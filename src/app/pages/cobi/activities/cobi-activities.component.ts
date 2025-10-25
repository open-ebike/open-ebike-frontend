import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { combineLatest, first } from 'rxjs';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {
  Activity,
  ActivityService,
} from '../../../services/api/cobi/activity.service';
import { MetersToKilometersPipe } from '../../../pipes/meters-to-kilometers.pipe';

/**
 * Displays activities
 */
@Component({
  selector: 'app-activities',
  imports: [
    TranslocoDirective,
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
    MatRipple,
    RouterLink,
    MatCardContent,
    MatCardActions,
    MatCardFooter,
    DatePipe,
    MetersToKilometersPipe,
  ],
  templateUrl: './cobi-activities.component.html',
  styleUrl: './cobi-activities.component.scss',
  standalone: true,
})
export class CobiActivitiesComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Activity service */
  private activityService = inject(ActivityService);

  //
  // Signals
  //

  /** Signal providing activities */
  activities = signal<Activity[]>([]);

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
    this.initializeActivities();
    this.handleQueryParameters();
  }

  /**
   * Initializes hubs
   */
  private initializeActivities() {
    this.activityService.getActivities().subscribe((activities) => {
      this.activities.set(activities.activities);
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
}
