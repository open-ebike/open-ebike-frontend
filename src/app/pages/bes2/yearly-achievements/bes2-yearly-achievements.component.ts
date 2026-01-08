import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { YearlyAchievementGridComponent } from '../../../components/yearly-achievement-grid/yearly-achievement-grid.component';
import { Bes2YearlyAchievementService } from '../../../services/yearly-achievement/bes2/bes2-yearly-achievement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { YearlyAchievementCarouselComponent } from '../../../components/yearly-achievement-carousel/yearly-achievement-carousel.component';
import { MatIconButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { combineLatest, first, firstValueFrom, map } from 'rxjs';
import { ActivityService } from '../../../services/api/bes2/activity.service';
import { Theme, ThemeService } from '../../../services/theme.service';

/**
 * Displays yearly achievements
 */
@Component({
  selector: 'app-bes2-yearly-achievements',
  imports: [
    TranslocoDirective,
    YearlyAchievementGridComponent,
    YearlyAchievementCarouselComponent,
    MatIcon,
    MatIconButton,
    MatProgressBar,
  ],
  templateUrl: './bes2-yearly-achievements.component.html',
  styleUrl: './bes2-yearly-achievements.component.scss',
  standalone: true,
})
export class Bes2YearlyAchievementsComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Yearly achievement service */
  public yearlyAchievementService = inject(Bes2YearlyAchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Activity service */
  private activityService = inject(ActivityService);

  //
  // Selections
  //

  /** Selected year */
  yearSelected = signal<number | undefined>(undefined);

  /** Language */
  lang = getBrowserLang();

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';

  /**
   * Constructor
   */
  constructor() {
    this.route.params.subscribe((params) => {
      const year = params['year'];
      this.yearSelected.set(isNaN(year) ? undefined : +year);
    });

    effect(() => {
      this.router.navigate(
        [`/bes2/yearly-achievements/${this.yearSelected() ?? ''}`],
        {
          queryParams: { theme: this.themeService.theme() },
        },
      );
    });
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init phase
   */
  ngOnInit() {
    this.handleQueryParameters();
  }

  //
  // Initialization
  //

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
   * Handles click on refresh button
   */
  onRefreshClicked() {
    // Retrieve data of first activity
    firstValueFrom(
      this.activityService.getAllActivitySummaries(1, 0).pipe(
        map((activitySummaries) => {
          return activitySummaries.activities.length > 0
            ? new Date(activitySummaries.activities[0].startTime)
            : new Date();
        }),
      ),
    ).then((firstActivityDate) => {
      this.yearlyAchievementService.initialize(firstActivityDate);
      this.yearlyAchievementService.evaluate();
    });
  }
}
