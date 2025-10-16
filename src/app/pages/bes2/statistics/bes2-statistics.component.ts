import { Component, inject, OnInit, signal } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  ActivityService,
  Statistics,
} from '../../../services/api/bes2/activity.service';
import { combineLatest, first } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MetersToKilometersPipe } from '../../../pipes/meters-to-kilometers.pipe';
import { RoundPipe } from '../../../pipes/round.pipe';

/**
 * Displays statistics
 */
@Component({
  selector: 'app-statistics',
  imports: [
    TranslocoDirective,
    MatIcon,
    MatRipple,
    MatButton,
    MatCardActions,
    MatCardFooter,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    DatePipe,
    MetersToKilometersPipe,
    RoundPipe,
  ],
  templateUrl: './bes2-statistics.component.html',
  styleUrl: './bes2-statistics.component.scss',
  standalone: true,
})
export class Bes2StatisticsComponent implements OnInit {
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

  //
  // Signals
  //

  /** Signal providing statistics */
  statistics = signal<Statistics | undefined>(undefined);

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
    this.initializeStatistics();
    this.handleQueryParameters();
  }

  //
  // Initialization
  //

  /**
   * Initializes statistics
   */
  private initializeStatistics() {
    this.activityService.getStatistics().subscribe((statistics) => {
      this.statistics.set(statistics);
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
