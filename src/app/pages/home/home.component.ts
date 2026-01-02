import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../services/theme.service';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import { combineLatest, first } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { EbikeGeneration } from '../../services/auth/ebike-generation.type';
import { MatButton } from '@angular/material/button';
import { ActivityRecordsService } from '../../services/api/bes3/activity-records.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EbikeProfileService } from '../../services/api/bes3/ebike-profile.service';

/**
 * Displays home component
 */
@Component({
  selector: 'app-home',
  imports: [
    TranslocoDirective,
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    RouterLink,
    MatProgressBar,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Snack bar */
  private snackbar = inject(MatSnackBar);
  /** Transloco service */
  private translocoService = inject(TranslocoService);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** eBike profile service */
  public ebikeProfileService = inject(EbikeProfileService);
  /** Activity records service */
  public activityRecordsService = inject(ActivityRecordsService);

  //
  // Signals
  //

  /** Selected eBike generation */
  selectedEbikeGeneration = signal<EbikeGeneration | undefined>(undefined);

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';

  /** Language */
  lang = getBrowserLang();

  /**
   * Constructor
   */
  constructor() {
    // Handle initial load after login
    effect(() => {
      if (
        this.authenticationService.loggedIn() &&
        this.authenticationService.ebikeGeneration() == 'BES3'
      ) {
        this.ebikeProfileService.fetchAll().then();
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
    });
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init phase
   */
  async ngOnInit() {
    this.handleQueryParameters();

    await this.authenticationService.processLoginCallback();
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
}
