import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme, ThemeService } from '../../services/theme.service';
import { AuthenticationService } from '../../services/authentication.service';
import {
  ActivityRecordsService,
  ActivitySummary,
  ActivitySummarySort,
} from '../../services/api/activity-records.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { combineLatest, first } from 'rxjs';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { MatList, MatListItem } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MetersToKilometersPipe } from '../../pipes/meters-to-kilometers.pipe';

/**
 * Displays activities
 */
@Component({
  selector: 'app-activities',
  imports: [
    TranslocoDirective,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    MatList,
    MatListItem,
    MatIcon,
    DatePipe,
    MatRipple,
    MetersToKilometersPipe,
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

  /** Signal providing activity summaries */
  activitySummaries = signal<ActivitySummary[]>([]);

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
    this.initializeActivities(20, 0, '-startTime');
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
  private initializeActivities(
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
