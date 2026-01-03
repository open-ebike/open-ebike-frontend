import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import { combineLatest, first } from 'rxjs';
import {
  EbikeProfile,
  EbikeProfileService,
} from '../../../services/api/bes3/ebike-profile.service';
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
import {
  EbikeRegistrationService,
  Registration,
} from '../../../services/api/bes3/ebike-registration.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BikePassService } from '../../../services/api/bes3/bike-pass.service';
import { BulkConfigurationService } from '../../../services/api/bes3/bulk-configuration.service';
import { DiagnosisFieldDataService } from '../../../services/api/bes3/diagnosis-field-data.service';
import { DigitalServiceBookService } from '../../../services/api/bes3/digital-service-book.service';

/**
 * Displays eBikes
 */
@Component({
  selector: 'app-bes3-ebikes',
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
  templateUrl: './bes3-ebikes.component.html',
  styleUrl: './bes3-ebikes.component.scss',
  standalone: true,
})
export class Bes3EbikesComponent implements OnInit {
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
  /** Bike pass service */
  private bikePassService = inject(BikePassService);
  /** Bulk configuration service */
  private bulkConfigurationService = inject(BulkConfigurationService);
  /** Diagnosis field data service */
  private diagnosisFieldDataService = inject(DiagnosisFieldDataService);
  /** Digital service book service */
  private digitalServiceBookService = inject(DigitalServiceBookService);
  /** eBike registration service */
  private ebikeRegistrationService = inject(EbikeRegistrationService);

  //
  // Signals
  //

  /** Signal providing eBike profiles */
  ebikeProfiles = signal<EbikeProfile[]>([]);
  /** Signal providing registrations */
  registrations = signal<Registration[]>([]);

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
    this.initializeRegistrations();
    this.handleQueryParameters();
  }

  /**
   * Initializes eBikes
   */
  private initializeEbikes() {
    this.ebikeProfileService.getAllBikes().subscribe((eBikeProfiles) => {
      this.ebikeProfiles.set(eBikeProfiles.bikes);
    });
  }

  /**
   * Initializes registrations
   */
  private initializeRegistrations() {
    this.ebikeRegistrationService
      .getRegistrations()
      .subscribe((registrations) => {
        this.registrations.set(registrations.registrations);
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
        bikes.bikes.forEach((bike) => {
          this.bikePassService.fetch(bike.id);
          this.bulkConfigurationService.fetch(bike.id);
          this.diagnosisFieldDataService.fetch(
            bike.driveUnit.partNumber,
            bike.driveUnit.serialNumber,
          );
          this.diagnosisFieldDataService.fetch(
            bike.remoteControl.partNumber,
            bike.remoteControl.serialNumber,
          );
          bike.batteries?.forEach((battery) => {
            this.diagnosisFieldDataService.fetch(
              battery.partNumber,
              battery.serialNumber,
            );
          });
          bike.antiLockBrakeSystems?.forEach((antiLockBrakeSystem) => {
            this.diagnosisFieldDataService.fetch(
              antiLockBrakeSystem.partNumber,
              antiLockBrakeSystem.serialNumber,
            );
          });
          if (bike.connectModule) {
            this.diagnosisFieldDataService.fetch(
              bike.connectModule.partNumber,
              bike.connectModule.serialNumber,
            );
          }
          if (bike.headUnit) {
            this.diagnosisFieldDataService.fetch(
              bike.headUnit.partNumber,
              bike.headUnit.serialNumber,
            );
          }
          this.digitalServiceBookService.fetch(bike.id);
        });
      });
    });
  }

  //
  // Helpers
  //

  /**
   * Determines if an ebike is registered
   * @param bikeId bike ID
   */
  isEbikeRegistered(bikeId: string) {
    return this.registrations().find(
      (registration) => registration.bikeRegistration?.bikeId === bikeId,
    );
  }
}
