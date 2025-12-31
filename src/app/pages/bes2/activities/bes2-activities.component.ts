import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MetersToKilometersPipe } from '../../../pipes/meters-to-kilometers.pipe';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import {
  MapBoxStyle,
  MapComponent,
  Origin,
  Overlay,
} from '../../../components/map/map.component';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { combineLatest, first } from 'rxjs';
import {
  ActivityDetail,
  ActivityService,
  ActivitySummary,
} from '../../../services/api/bes2/activity.service';
import { MapboxService } from '../../../services/mapbox.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
} from '@angular/material/card';
import { environment } from '../../../../environments/environment';

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
    MatCardActions,
    MatCardFooter,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './bes2-activities.component.html',
  styleUrl: './bes2-activities.component.scss',
  standalone: true,
})
export class Bes2ActivitiesComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Theme service */
  private themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Activity service */
  private activityService = inject(ActivityService);
  /** Mapbox service */
  public mapboxService = inject(MapboxService);

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

  drawerStart = viewChild<MatDrawer>('drawerStart');
  drawerEnd = viewChild<MatDrawer>('drawerEnd');

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

  mapId = 'activities';
  mapHeight = 'calc(100vh - 64px - 128px)';
  mapStyle = MapBoxStyle.LIGHT_V10;

  overlays: Map<string, Overlay> = new Map<string, Overlay>();
  boundingBox: number[] | undefined;

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
    this.mapboxService.restoreConfig();
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
      this.initializeMapOverlay(id, activityDetails);
    });
  }

  /**
   * Initializes map overlay
   * @param id activity ID
   * @param activityDetails activity details
   */
  private initializeMapOverlay(id: number, activityDetails: ActivityDetail) {
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
          'line-color': '#d75b98',
          'line-width': 8,
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
      environment.mapbox.boundBoxPaddingHorizontal,
      environment.mapbox.boundBoxPaddingVertical,
    );
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
   * Handles click on an activity
   * @param id ID
   */
  onActivityClicked(id: number) {
    this.id.set(id);
    this.drawerStart()?.close();
    this.drawerEnd()?.open();
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
