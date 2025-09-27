import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../services/theme.service';
import { AuthenticationService } from '../../services/authentication.service';
import {
  ActivityDetail,
  ActivityRecordsService,
  ActivitySummary,
  ActivitySummarySort,
} from '../../services/api/activity-records.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { combineLatest, first } from 'rxjs';
import { MatList, MatListItem } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MetersToKilometersPipe } from '../../pipes/meters-to-kilometers.pipe';
import { MatCard, MatCardAvatar, MatCardContent } from '@angular/material/card';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';

/**
 * Displays activities
 */
@Component({
  selector: 'app-activities',
  imports: [
    TranslocoDirective,
    MatList,
    MatListItem,
    MatIcon,
    DatePipe,
    MatRipple,
    MetersToKilometersPipe,
    MatCard,
    RouterLink,
    MatCardAvatar,
    MatCardContent,
    MatSidenavModule,
    MatButton,
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
  standalone: true,
})
export class ActivitiesComponent implements OnInit {
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
  /** Activity records service */
  private activityRecordsService = inject(ActivityRecordsService);

  //
  // Signals
  //

  /** Signal providing the selected activity ID */
  id = signal<string | null>(null);
  /** Signal providing the selected activity */
  selectedActivity: Signal<ActivitySummary | undefined> = computed(() => {
    return this.activitySummaries().find(
      (activitySummary) => activitySummary.id === this.id(),
    );
  });
  /** Signal providing activity summaries */
  activitySummaries = signal<ActivitySummary[]>([]);
  /** Signal providing activity details */
  activityDetails = signal<ActivityDetail[]>([]);

  drawer = viewChild(MatDrawer);

  /** Language */
  lang = getBrowserLang();

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init phase
   */
  ngOnInit() {
    this.initializeTheme();
    this.initializeActivitiesSummaries(20, 0, '-startTime');

    this.route.params.subscribe((params) => {
      this.id.set(params['id']);

      if (params['id']?.length > 0) {
        this.initializeActivityDetails(params['id']);
      } else {
        this.activityDetails.set([]);
      }
    });

    this.handleQueryParameters();
  }

  //
  // Initialization
  //

  /**
   * Initializes theme
   */
  private initializeTheme() {
    switch (this.themeService.theme()) {
      case Theme.LIGHT: {
        this.updateQueryParameters();
        break;
      }
      case Theme.DARK: {
        this.updateQueryParameters();
        break;
      }
    }
  }

  /**
   * Initializes activities
   */
  private initializeActivitiesSummaries(
    limit: number,
    offset: number,
    sort: ActivitySummarySort,
  ) {
    this.activityRecordsService
      .getAllActivitySummaries(limit, offset, sort)
      .subscribe((activitySummaries) => {
        this.activitySummaries.set(activitySummaries.activitySummaries);
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
   * Handles query parameters
   */
  private handleQueryParameters() {
    combineLatest([this.route.queryParams])
      .pipe(first())
      .subscribe(([queryParams]) => {
        const theme = queryParams[this.QUERY_PARAM_THEME];

        this.themeService.switchTheme(theme ? theme : Theme.LIGHT);
      });
  }

  //
  // Actions
  //

  /**
   * Handles click on an activity
   * @param id ID
   */
  onActivityClicked(id: string) {
    this.id.set(id);
    this.drawer()?.close();
  }

  /**
   * Handles the drawer closed state
   */
  onDrawerClosed(): void {
    this.router.navigate(['/activities', this.id()]);
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
        },
      })
      .then();
  }
}
