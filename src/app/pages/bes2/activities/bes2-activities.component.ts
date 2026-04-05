import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MetersToKilometersPipe } from '../../../pipes/meters-to-kilometers.pipe';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  ImageMarker,
  MapBoxStyle,
  MapComponent,
  Origin,
  Overlay,
} from '../../../components/map/map.component';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { combineLatest, first, range } from 'rxjs';
import {
  ActivityDetail,
  ActivityService,
  ActivitySummary,
} from '../../../services/api/bes2/activity.service';
import { MapboxService, Marker } from '../../../services/mapbox.service';
import { environment } from '../../../../environments/environment';
import {
  MapillaryImage,
  MapillaryService,
} from '../../../services/mapillary.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SharePictureActivityBottomSheetComponent } from '../../../components/share-picture-activity-bottom-sheet/share-picture-activity-bottom-sheet.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MapLeafletComponent } from '../../../components/map-leaflet/map-leaflet.component';
import { ConsentService } from '../../../services/consent.service';

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
}

/**
 * Displays activities
 */
@Component({
  selector: 'app-bes2-activities',
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
    MatIconButton,
    MatProgressBar,
    MapLeafletComponent,
  ],
  templateUrl: './bes2-activities.component.html',
  styleUrl: './bes2-activities.component.scss',
  standalone: true,
})
export class Bes2ActivitiesComponent implements OnInit {
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
  /** Theme service */
  private themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Activity service */
  public activityService = inject(ActivityService);
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
  id = signal<number | undefined>(undefined);
  /** Signal providing the selected activity */
  selectedActivity: Signal<ActivitySummary | undefined> = computed(() => {
    return this.activitySummaries().find(
      (activitySummary) => activitySummary.id == this.id(),
    );
  });
  /** Signal providing activity summaries */
  activitySummaries = signal<ActivitySummary[]>([]);
  /** Signal providing activity details */
  activityDetails = signal<ActivityDetail | undefined>(undefined);
  /** Activity images */
  activityImages = signal<MapillaryImage[]>([]);

  drawerStart = viewChild<MatDrawer>('drawerStart');
  drawerEnd = viewChild<MatDrawer>('drawerEnd');

  showImages = signal(true);

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
  /** Map ID */
  mapId = 'activities';

  // Mapbox

  toolbarHeight = signal(64);
  innerContainerHeight = signal(160);
  mapHeight = computed(() => {
    return `calc(100vh - ${this.toolbarHeight()}px - ${this.innerContainerHeight()}px)`;
  });
  mapStyle = MapBoxStyle.LIGHT_V10;

  overlays: Map<string, Overlay> = new Map<string, Overlay>();
  markers: Marker[] = [];
  imageMarkers: ImageMarker[] = [];
  boundingBox: number[] | undefined;

  // Leaflet

  /** Coordinates of activity */
  coordinates = computed<Coordinate[]>(() => {
    return (
      this.activityDetails()
        ?.coordinates?.map((outer) => {
          return outer?.map((inner, index) => {
            return {
              index,
              latitude: inner?.latitude ?? 0,
              longitude: inner?.longitude ?? 0,
            };
          });
        })
        .flat()
        .filter((activityDetail) => {
          return (
            activityDetail.latitude != 0.0 || activityDetail.longitude != 0.0
          );
        }) ?? []
    );
  });
  coordinateStart: Coordinate | undefined = undefined;
  coordinateEnd: Coordinate | undefined = undefined;

  /** Language */
  lang = getBrowserLang();

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';
  /** Query parameter activity ID */
  private QUERY_ACTIVITY_ID: string = 'id';

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this.initializeActivitiesSummaries(this.pageSize(), this.pageOffset());
    });

    effect(() => {
      if (this.id() != undefined) {
        this.initializeActivityDetails(this.id() ?? 0);
        this.updateQueryParameters();
      } else {
        this.drawerStart()?.open();
      }
    });

    effect(() => {
      if (this.mapLoaded() && this.id() && this.activitySummaries().length > 0)
        setTimeout(() => {
          this.initializeMapOverlay(this.id(), this.activityDetails());

          if (this.consentService.consentMapillary()) {
            this.initializeMapillaryImages(
              Math.ceil((this.selectedActivity()?.totalDistance ?? 0) / 500),
              this.activityDetails(),
            );
          }
        }, 500);
    });

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

    effect(() => {
      if (this.windowWidth() <= 960) {
        this.toolbarHeight.set(56);
        this.innerContainerHeight.set(172);
      } else {
        this.toolbarHeight.set(64);
        this.innerContainerHeight.set(128);
      }
    });

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
    this.activityService
      .getAllActivitySummaries(limit, offset)
      .subscribe((activitySummaries) => {
        this.activitySummaries.set(activitySummaries.activities);
        this.pageTotalLength.set(activitySummaries.pagination.total);
      });
  }

  /**
   * Initializes activity details
   */
  private initializeActivityDetails(id: number) {
    this.activityService.getActivityDetails(id).subscribe((activityDetails) => {
      this.activityDetails.set(activityDetails);
    });
  }

  /**
   * Initializes map overlay
   * @param id activity ID
   * @param activityDetails activity details
   */
  private initializeMapOverlay(id?: number, activityDetails?: ActivityDetail) {
    if (id == undefined || activityDetails == undefined) {
      return;
    }

    const geojson = this.mapboxService.buildBes2Geojson(activityDetails);

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

    this.overlays.set(`${id}`, overlay);
    this.overlays = new Map(this.overlays);
    this.boundingBox = this.mapboxService.buildBoundingBoxWithPadding(
      geojson.features[0]['properties']['bounding-box'],
    );
  }

  /**
   * Initializes Mapillary images
   * @param count count
   * @param activityDetails activity details
   */
  private initializeMapillaryImages(
    count: number,
    activityDetails?: ActivityDetail,
  ) {
    this.activityImages.set([]);

    range(1, count).subscribe((index) => {
      const coordinates = activityDetails?.coordinates?.flat()?.flat() ?? [];
      const position = Math.floor(coordinates.length / (count + 1)) * index;

      const coordinate = coordinates[position]!!;

      this.mapillaryService
        .getImageByLocation(coordinate.latitude, coordinate.longitude, 0.001)
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
        const id = queryParams[this.QUERY_ACTIVITY_ID];

        this.themeService.switchTheme(theme ? theme : Theme.LIGHT);
        if (id?.trim().length > 0) {
          this.id.set(id);
        }
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
    this.activityService.fetchAll().then((success) => {
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
  onActivityClicked(id: number) {
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
   * Updates query parameters
   */
  private updateQueryParameters() {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {
          [this.QUERY_PARAM_THEME]: this.themeService.theme(),
          [this.QUERY_ACTIVITY_ID]: this.id() ? this.id() : null,
        },
      })
      .then();
  }
}
