import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  model,
  OnInit,
  Signal,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  ActivityDetail,
  ActivityRecordsService,
  ActivitySummary,
} from '../../../services/api/bes3/activity-records.service';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import {
  combineLatest,
  first,
  interval,
  map,
  range,
  scan,
  takeWhile,
} from 'rxjs';
import { MatList, MatListItem } from '@angular/material/list';
import { DatePipe, NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MetersToKilometersPipe } from '../../../pipes/meters-to-kilometers.pipe';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  FreeCameraOptions,
  ImageMarker,
  MapBoxStyle,
  MapComponent,
  Origin,
  Overlay,
} from '../../../components/map/map.component';
import { MapboxService, Marker } from '../../../services/mapbox.service';
import { MatPaginator } from '@angular/material/paginator';
import { RoundPipe } from '../../../pipes/round.pipe';
import {
  MapillaryImage,
  MapillaryService,
} from '../../../services/mapillary.service';
import { environment } from '../../../../environments/environment';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SharePictureActivityBottomSheetComponent } from '../../../components/share-picture-activity-bottom-sheet/share-picture-activity-bottom-sheet.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapLeafletComponent } from '../../../components/map-leaflet/map-leaflet.component';
import { ConsentService } from '../../../services/consent.service';
import { Media, MediaService } from '../../../services/media.service';
import { ScatterChartComponent } from '../../../components/scatter-chart/scatter-chart.component';
import { FlyoverControlsComponent } from '../../../components/flyover-controls/flyover-controls.component';
import { bearing, destination } from '@turf/turf';
import { FlyOverRecordingService } from '../../../services/recording/fly-over-recording.service';
import { ShareFlyOverBottomSheetComponent } from '../../../components/share-fly-over-bottom-sheet/share-fly-over-bottom-sheet.component';

/**
 * Represents a coordinate
 */
export interface Coordinate {
  /** Index */
  index: number;
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;

  /** Altitude */
  altitude: number;
  /** Speed */
  speed: number;
  /** Cadence */
  cadence: number;
  /** Rider power */
  riderPower: number;
}

/**
 * Represents a mode
 */
enum Mode {
  REGULAR = 'regular',
  FLY_OVER = 'fly-over',
}

/**
 * Displays activities
 */
@Component({
  selector: 'app-bes3-activities',
  imports: [
    TranslocoDirective,
    MatList,
    MatListItem,
    MatIcon,
    DatePipe,
    MatRipple,
    MetersToKilometersPipe,
    MatSidenavModule,
    MatButton,
    MapComponent,
    MatPaginator,
    RoundPipe,
    MatIconButton,
    MatProgressBar,
    MapLeafletComponent,
    ScatterChartComponent,
    NgStyle,
    FlyoverControlsComponent,
  ],
  templateUrl: './bes3-activities.component.html',
  styleUrl: './bes3-activities.component.scss',
  standalone: true,
})
export class Bes3ActivitiesComponent implements OnInit {
  //
  // Injections
  //

  /** Snack bar */
  private snackbar = inject(MatSnackBar);
  /** Bottom sheet */
  private bottomSheet = inject(MatBottomSheet);
  /** Transloco service */
  private translocoService = inject(TranslocoService);
  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Media service */
  public mediaService = inject(MediaService);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Activity records service */
  public activityRecordsService = inject(ActivityRecordsService);
  /** Fly-over recording service */
  private flyOverRecordingService = inject(FlyOverRecordingService);
  /** Mapbox service */
  public mapboxService = inject(MapboxService);
  /** Mapillary service */
  public mapillaryService = inject(MapillaryService);
  /** Consent service */
  public consentService = inject(ConsentService);

  //
  // Signals
  //

  /** Signal providing the selected activity ID */
  id = signal<string>('');
  /** Signal providing the selected activity */
  selectedActivity: Signal<ActivitySummary | undefined> = computed(() => {
    return this.activitySummaries().find(
      (activitySummary) => activitySummary.id == this.id(),
    );
  });
  /** Signal providing activity summaries */
  activitySummaries = signal<ActivitySummary[]>([]);
  /** Signal providing activity details */
  activityDetails = signal<ActivityDetail[]>([]);
  /** Activity images */
  activityImages = signal<MapillaryImage[]>([]);

  drawerStart = viewChild<MatDrawer>('drawerStart');
  drawerEnd = viewChild<MatDrawer>('drawerEnd');

  showImages = signal(true);
  showCharts = signal(true);
  showMode = signal<Mode>(Mode.REGULAR);

  flyoverProgress = signal(0);
  flyoverPeriod = computed<number>(() => {
    return this.selectedActivity()?.distance ?? 5_000 / 500;
  });

  //
  // Paginator
  //

  pageTotalLength = signal(0);
  pageIndex = signal(0);
  pageSize = signal(20);
  pageOffset = computed(() => this.pageIndex() * this.pageSize());

  pageSizeOptions = [1, 20, 50, 100];

  //
  // Map
  //

  windowWidth = signal<number>(960);

  /** Map loaded */
  mapLoaded = signal(false);
  /** Hovered coordinate */
  hoveredCoordinate = model<Coordinate | undefined>(undefined);

  // Mapbox

  toolbarHeight = signal(64);
  innerContainerHeight = signal(160);
  mapHeight = computed(() => {
    return `calc(100vh - ${this.toolbarHeight()}px - ${this.innerContainerHeight()}px)`;
  });
  mapStyle = MapBoxStyle.LIGHT_V10;

  overlays: Map<string, Overlay> = new Map<string, Overlay>();
  overlaysFlyOver: Map<string, Overlay> = new Map<string, Overlay>();
  markers: Marker[] = [];
  imageMarkers: ImageMarker[] = [];
  boundingBox: number[] | undefined;

  /** Camera-to options */
  cameraTo = signal<FreeCameraOptions | undefined>(undefined);

  // Leaflet

  /** Coordinates of activity */
  coordinates = computed<Coordinate[]>(() => {
    return this.activityDetails()
      .filter((activityDetail) => {
        return (
          activityDetail.latitude != 0.0 || activityDetail.longitude != 0.0
        );
      })
      .map((activityDetail, index) => {
        return {
          index,
          latitude: activityDetail.latitude,
          longitude: activityDetail.longitude,
          altitude: activityDetail.altitude,
          speed: activityDetail.speed,
          cadence: activityDetail.cadence,
          riderPower: activityDetail.riderPower,
        };
      });
  });
  coordinateStart: Coordinate | undefined = undefined;
  coordinateEnd: Coordinate | undefined = undefined;

  //
  // Fly-over
  //

  /** Camera behind */
  cameraBehind = 2_500;
  /** Camera altitude */
  cameraAltitude = 2_000;

  //
  // Recording
  //

  /** Recorder */
  recorder: any = undefined;
  /** Chunks */
  chunks: any[] = [];

  /** Map component */
  recordingActivitiesFlyover = viewChild<MapComponent | undefined>(
    'activitiesFlyoverRecording',
  );
  /** Map loaded */
  recordingMapLoaded = signal(false);
  /** Whether control is playing */
  recordingPlaying = signal(false);
  /** Fly-over progress */
  recordingFlyoverProgress = signal(0);
  /** Fly-over period */
  recordingFlyoverPeriod = computed<number>(() => {
    return this.selectedActivity()?.distance ?? 5_000 / 250;
  });
  /** Whether recording exists in database */
  recordingExists = signal(false);
  /** Camera-to options */
  recordingCameraTo = signal<FreeCameraOptions | undefined>(undefined);

  //
  // Chart
  //

  attributes = ['altitude', 'speed', 'cadence', 'riderPower'];

  //
  // Enums
  //

  /** Language */
  lang = getBrowserLang();
  /** Mode enum */
  modeEnum = Mode;
  /** Media enum */
  mediaEnum = Media;
  /** Mapbox style */
  mapboxStyle = MapBoxStyle;

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';
  /** Query parameter activity ID */
  private QUERY_PARAM_ACTIVITY_ID: string = 'id';
  /** Query parameter mode */
  private QUERY_PARAM_MODE: string = 'mode';

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this.initializeActivitiesSummaries(this.pageSize(), this.pageOffset());
    });

    effect(() => {
      if (this.id()?.trim().length > 0) {
        this.initializeActivityDetails(this.id()?.trim());
        this.updateQueryParameters();
      } else {
        this.activityDetails.set([]);
        this.drawerStart()?.open();
      }
    });

    // Handles overlays
    effect(() => {
      if (this.mapLoaded() && this.activityDetails().length > 0) {
        this.initializeMapOverlay(this.id(), this.activityDetails());
        this.initializeMapOverlayFlyOver(this.id(), this.activityDetails());
      }
    });

    // Handles image markers
    effect(() => {
      if (this.consentService.consentMapillary()) {
        this.initializeMapillaryImages(
          Math.ceil((this.selectedActivity()?.distance ?? 0) / 500),
          this.activityDetails(),
        );
      }
    });

    // Handles markers
    effect(() => {
      if (this.coordinates().length > 1) {
        this.coordinateStart = this.coordinates()[0];
        this.coordinateEnd = this.coordinates()[this.coordinates().length - 1];
        this.markers = [
          {
            longitude: this.coordinateStart.longitude,
            latitude: this.coordinateStart.latitude,
            color: '#ffffff',
          },
          {
            longitude: this.coordinateEnd.longitude,
            latitude: this.coordinateEnd.latitude,
            color: '#5261ac',
          },
        ];
      }
    });

    // Handles image markers
    effect(() => {
      this.imageMarkers = (this.activityImages() ?? []).map((image) => {
        return {
          longitude: image.geometry.coordinates[0],
          latitude: image.geometry.coordinates[1],
          imageUrl: image.thumb_1024_url!!,
          imageCreator: image.creator,
        };
      });
    });

    // Handles resizing
    effect(() => {
      if (this.windowWidth() <= 960) {
        this.toolbarHeight.set(56);
        this.innerContainerHeight.set(216);
      } else {
        this.toolbarHeight.set(64);
        this.innerContainerHeight.set(128);
      }
    });

    // Handles theme
    effect(() => {
      switch (this.themeService.theme()) {
        case Theme.LIGHT: {
          this.mapStyle = MapBoxStyle.LIGHT_V10;
          break;
        }
        case Theme.DARK: {
          this.mapStyle = MapBoxStyle.DARK_V10;
          break;
        }
      }
    });

    // Handles fly-over animation
    effect(() => {
      if (this.coordinates().length > 0) {
        const index = Math.floor(
          (this.flyoverProgress() / 100) * this.coordinates().length,
        );
        const padding = 500;
        const indexPrev = Math.max(0, index - padding);
        const indexNext = Math.min(
          index + padding,
          this.coordinates().length - 1,
        );

        const center = this.coordinates()[index];
        const prev = this.coordinates()[indexPrev];
        const next = this.coordinates()[indexNext];

        if (center && prev && next) {
          const behind = this.getPointBehind(
            [center.longitude, center.latitude],
            [next.longitude, next.latitude],
            this.cameraBehind,
          );

          this.cameraTo.set({
            position: {
              index,
              latitude: behind[1],
              longitude: behind[0],
            },
            lookAtPoint: {
              index: indexNext,
              latitude: center.latitude,
              longitude: center.longitude,
            },
            cameraAltitude: this.cameraAltitude,
          });
        }
      }
    });

    //
    // Fly-over recording
    //

    // Handles recording database lookup
    effect(() => {
      this.flyOverRecordingService
        .existsFlyoverRecording(this.id())
        .subscribe((exists) => {
          this.recordingExists.set(exists);

          if (!exists) {
            this.recordingPlaying.set(true);
            this.snackbar.open(
              this.translocoService.translate(
                `pages.activities.messages.fly-over-recording-started`,
              ),
              undefined,
              {
                duration: 500,
              },
            );
          }
        });
    });

    // Handles recording start
    effect(() => {
      if (
        this.recordingPlaying() &&
        this.recordingActivitiesFlyover() &&
        this.recordingMapLoaded() &&
        this.coordinates().length > 0
      ) {
        // @ts-ignore
        const canvas = this.recordingActivitiesFlyover().map.getCanvas();
        const stream = canvas.captureStream(30);

        this.recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm; codecs=vp9', // VP9 is superior to VP8
          videoBitsPerSecond: 20000000,
        });
        this.recorder.ondataavailable = (e: any) => this.chunks.push(e.data);
        this.recorder.start();

        untracked(() => {
          // Schedule animation
          interval(
            (this.recordingFlyoverPeriod() * 1_000) / this.coordinates().length,
          )
            .pipe(
              map(() => 100 / this.coordinates().length),
              scan((acc, curr) => acc + curr, this.recordingFlyoverProgress()),
              takeWhile((_) => {
                return this.recordingPlaying();
              }),
              map((value) => Math.min(value, 100)),
            )
            .subscribe((value) => {
              this.recordingFlyoverProgress.set(value);
            });
        });
      }
    });

    // Handles recording fly-over animation
    effect(() => {
      if (this.coordinates().length > 0) {
        const index = Math.floor(
          (this.recordingFlyoverProgress() / 100) * this.coordinates().length,
        );
        const padding = 400;
        const indexPrev = Math.max(0, index - padding);
        const indexNext = Math.min(
          index + padding,
          this.coordinates().length - 1,
        );

        const center = this.coordinates()[index];
        const prev = this.coordinates()[indexPrev];
        const next = this.coordinates()[indexNext];

        if (center && prev && next) {
          const behind = this.getPointBehind(
            [center.longitude, center.latitude],
            [next.longitude, next.latitude],
            this.cameraBehind,
          );

          this.recordingCameraTo.set({
            position: {
              index,
              latitude: behind[1],
              longitude: behind[0],
            },
            lookAtPoint: {
              index: indexNext,
              latitude: center.latitude,
              longitude: center.longitude,
            },
            cameraAltitude: this.cameraAltitude,
          });
        }
      }
    });

    // Handles recording stop
    effect(() => {
      if (this.recordingFlyoverProgress() >= 100) {
        this.recordingPlaying.set(false);
        this.snackbar.open(
          this.translocoService.translate(
            `pages.activities.messages.fly-over-recording-stopped`,
          ),
          undefined,
          {
            duration: 1_500,
          },
        );

        this.recorder.stop();
        this.recorder.onstop = async () => {
          const blob = new Blob(this.chunks, { type: 'video/webm' });
          this.flyOverRecordingService.store(this.id(), blob);
        };
      }
    });
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init phase
   */
  ngOnInit() {
    this.windowWidth.set(window.innerWidth);
    this.handleQueryParameters();
  }

  //
  // Initialization
  //

  /**
   * Initializes activities
   */
  private initializeActivitiesSummaries(limit: number, offset: number) {
    this.activityRecordsService
      .getAllActivitySummaries(limit, offset)
      .subscribe((activitySummaries) => {
        this.activitySummaries.set(activitySummaries.activitySummaries);
        this.pageTotalLength.set(activitySummaries.pagination.total);
      });
  }

  /**
   * Initializes activity details
   */
  private initializeActivityDetails(id: string) {
    this.activityRecordsService
      .getActivityDetails(id)
      .subscribe((activityDetails) => {
        this.activityDetails.set(activityDetails.activityDetails);
      });
  }

  /**
   * Initializes map overlay
   * @param id activity ID
   * @param activityDetails activity details
   */
  private initializeMapOverlay(id: string, activityDetails: ActivityDetail[]) {
    const geojson = this.mapboxService.buildBes3Geojson(activityDetails);

    const overlayId = 'activity-details';
    const source = {
      origin: Origin.INLINE,
      name: overlayId,
      value: JSON.stringify(geojson),
    };
    const layer = {
      origin: Origin.INLINE,
      name: `${overlayId}-layer`,
      value: JSON.stringify({
        id: `${overlayId}-layer`,
        type: 'line',
        source: overlayId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#5261ac',
          'line-width': 4,
        },
      }),
    };
    const overlay = {
      source,
      layers: [layer],
    };

    this.overlays.set(id, overlay);
    this.overlays = new Map(this.overlays);
    this.boundingBox = this.mapboxService.buildBoundingBoxWithPadding(
      geojson.features[0]['properties']['bounding-box'],
    );
  }

  /**
   * Initializes map overlay
   * @param id activity ID
   * @param activityDetails activity details
   */
  private initializeMapOverlayFlyOver(
    id: string,
    activityDetails: ActivityDetail[],
  ) {
    const geojson = this.mapboxService.buildBes3Geojson(activityDetails);

    const overlayId = 'activity-details';
    const source = {
      origin: Origin.INLINE,
      name: overlayId,
      value: JSON.stringify(geojson),
    };
    const layer = {
      origin: Origin.INLINE,
      name: `${overlayId}-layer`,
      value: JSON.stringify({
        id: `${overlayId}-layer`,
        type: 'line',
        source: overlayId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'white',
          'line-width': 8,
        },
      }),
    };
    const overlay = {
      source,
      layers: [layer],
    };

    this.overlaysFlyOver.set(id, overlay);
    this.overlaysFlyOver = new Map(this.overlaysFlyOver);
  }

  /**
   * Initializes Mapillary images
   * @param count count
   * @param activityDetails activity details
   */
  private initializeMapillaryImages(
    count: number,
    activityDetails: ActivityDetail[],
  ) {
    this.activityImages.set([]);

    range(1, count).subscribe((index) => {
      const position = Math.floor(activityDetails.length / (count + 1)) * index;

      const activityDetail = activityDetails[position];

      this.mapillaryService
        .getImageByLocation(
          activityDetail.latitude,
          activityDetail.longitude,
          0.001,
        )
        .subscribe((response) => {
          this.activityImages.set(
            this.activityImages().concat(...response.data),
          );
        });
    });
  }

  /**
   * Handles query parameters
   */
  private handleQueryParameters() {
    combineLatest([this.route.queryParams])
      .pipe(first())
      .subscribe(([queryParams]) => {
        const theme = queryParams[this.QUERY_PARAM_THEME];
        const id = queryParams[this.QUERY_PARAM_ACTIVITY_ID];
        const mode = queryParams[this.QUERY_PARAM_MODE];

        this.themeService.switchTheme(theme ? theme : Theme.LIGHT);
        if (id?.trim().length > 0) {
          this.id.set(id);
        }
        this.showMode.set(mode ?? Mode.REGULAR);
      });
  }

  //
  // Actions
  //

  /**
   * Handles window resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.windowWidth.set(window.innerWidth);
  }

  /**
   * Handles click on refresh button
   */
  onRefreshClicked() {
    this.activityRecordsService.fetchAll().then((success) => {
      this.snackbar.open(
        this.translocoService.translate(
          `pages.activities.messages.fetching-activities-${success ? 'successful' : 'failed'}`,
        ),
        undefined,
        {
          duration: 1_500,
        },
      );
    });
  }

  /**
   * Handles click on an activity
   * @param id ID
   */
  onActivityClicked(id: string) {
    this.id.set(id);
    this.drawerStart()?.close();
    this.drawerEnd()?.open();
  }

  /**
   * Handles toggle of image visibility
   */
  onToggleImagesClicked() {
    this.showImages.set(!this.showImages());
  }

  /**
   * Handles toggle of flyover mode
   */
  onToggleFlyoverModeClicked() {
    this.showMode.set(
      this.showMode() == Mode.FLY_OVER ? Mode.REGULAR : Mode.FLY_OVER,
    );
  }

  /**
   * Handles toggle of charts visibility
   */
  onToggleChartsClicked() {
    this.showCharts.set(!this.showCharts());
  }

  /**
   * Handles click on image marker
   * @param imageMarker image marker
   */
  onImageMarkerClicked(imageMarker: ImageMarker) {
    this.bottomSheet.open(SharePictureActivityBottomSheetComponent, {
      data: {
        title: this.translocoService.translate(
          `pages.activities.messages.activity-on-by-bosch-powered-ebike`,
          { title: this.selectedActivity()?.title },
          this.lang,
        ),
        description: `${environment.appTitle} | ${new Date(this.selectedActivity()?.startTime!!).toLocaleDateString()}`,
        imageUrl: imageMarker.imageUrl,
        imageCreator: imageMarker.imageCreator,
      },
    });
  }

  /**
   * Handles click on download-fly-over-recording button
   */
  onDownloadFlyOverRecordingClicked() {
    this.flyOverRecordingService
      .getFlyOverRecording(this.id())
      .subscribe((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = `flyover-${this.id()}.webm`; // The filename
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      });
  }

  /**
   * Handles click on share-fly-over-recording button
   */
  onShareFlyOverRecordingClicked() {
    this.flyOverRecordingService
      .getFlyOverRecording(this.id())
      .subscribe((blob) => {
        this.bottomSheet.open(ShareFlyOverBottomSheetComponent, {
          data: {
            title: this.selectedActivity()?.title,
            description: `${environment.appTitle}`,
            blob: blob,
          },
        });
      });
  }

  /**
   * Handles page event
   * @param event event
   */
  handlePageEvent(event: any) {
    if (event.pageSize !== this.pageSize()) {
      this.pageSize.set(event.pageSize);
      this.pageIndex.set(0);
    } else {
      this.pageIndex.set(event.pageIndex);
    }
  }

  //
  // Helpers
  //

  /**
   * Retrieves a point on a geodesic defined by two given points
   * @param pointA point A
   * @param pointB point B
   * @param cameraBehind distance behind point A in meters
   */
  private getPointBehind(
    pointA: number[],
    pointB: number[],
    cameraBehind: number,
  ) {
    const reverseBearing = bearing(pointA, pointB) - 180;
    return destination(pointA, cameraBehind, reverseBearing, {
      units: 'meters',
    }).geometry.coordinates;
  }

  /**
   * Updates query parameters
   */
  private updateQueryParameters() {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {
          [this.QUERY_PARAM_THEME]: this.themeService.theme(),
          [this.QUERY_PARAM_ACTIVITY_ID]: this.id() ? this.id() : null,
          [this.QUERY_PARAM_MODE]: this.showMode() ? this.showMode() : null,
        },
      })
      .then();
  }
}
