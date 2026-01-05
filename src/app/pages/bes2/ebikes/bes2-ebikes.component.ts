import { Component, inject, OnInit, signal } from '@angular/core';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
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
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  EbikeProfile,
  EbikeProfileService,
} from '../../../services/api/bes2/ebike-profile.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Theme, ThemeService } from '../../../services/theme.service';
import { combineLatest, first } from 'rxjs';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiagnosisEventService } from '../../../services/api/bes2/diagnosis-event.service';
import { DiagnosisFieldDataService } from '../../../services/api/bes2/diagnosis-field-data.service';
import { ReleaseManagementService } from '../../../services/api/bes2/release-management.service';

/**
 * Displays eBikes
 */
@Component({
  selector: 'app-bes2-ebikes',
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
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './bes2-ebikes.component.html',
  styleUrl: './bes2-ebikes.component.scss',
  standalone: true,
})
export class Bes2EbikesComponent implements OnInit {
  //
  // Injections
  //

  /** Snack bar */
  private snackbar = inject(MatSnackBar);
  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Transloco service */
  private translocoService = inject(TranslocoService);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** eBike profile service */
  public ebikeProfileService = inject(EbikeProfileService);
  /** Diagnosis event service */
  private diagnosisEventService = inject(DiagnosisEventService);
  /** Diagnosis field data service */
  private diagnosisFieldDataService = inject(DiagnosisFieldDataService);
  /** Release management service */
  private releaseManagementService = inject(ReleaseManagementService);

  //
  // Signals
  //

  /** Signal providing eBike profiles */
  ebikeProfiles = signal<EbikeProfile[] | undefined>([]);

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
    this.initializeEbikes();
    this.handleQueryParameters();
  }

  /**
   * Initializes eBikes
   */
  private initializeEbikes() {
    this.ebikeProfileService.getAllBikes().subscribe((eBikeProfiles) => {
      this.ebikeProfiles.set(eBikeProfiles?.bikes);
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
   * Handles click on refresh button
   */
  onRefreshClicked() {
    this.ebikeProfileService.fetchAll().then((success) => {
      this.snackbar.open(
        this.translocoService.translate(
          `pages.ebikes.messages.fetching-ebikes-${success ? 'successful' : 'failed'}`,
        ),
        undefined,
        {
          duration: 1_500,
        },
      );

      this.ebikeProfileService.getAllBikes().subscribe((bikes) => {
        bikes?.bikes.forEach((bike) => {
          this.diagnosisEventService.fetch(
            bike.driveUnit.partNumber,
            bike.driveUnit.serialNumber,
          );
          this.diagnosisFieldDataService.fetch(
            bike.driveUnit.partNumber,
            bike.driveUnit.serialNumber,
          );
          this.releaseManagementService.fetch(
            bike.driveUnit.partNumber,
            bike.driveUnit.serialNumber,
          );
        });
      });
    });
  }
}
