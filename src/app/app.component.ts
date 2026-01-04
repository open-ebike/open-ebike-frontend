import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme, ThemeService } from './services/theme.service';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { environment } from '../environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { Meta } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { EbikeProfileService } from './services/api/bes3/ebike-profile.service';
import { BikePassService } from './services/api/bes3/bike-pass.service';
import { BulkConfigurationService } from './services/api/bes3/bulk-configuration.service';
import { DiagnosisFieldDataService } from './services/api/bes3/diagnosis-field-data.service';
import { DigitalServiceBookService } from './services/api/bes3/digital-service-book.service';
import { ReleaseManagementService } from './services/api/bes3/release-management.service';
import { RemoteConfigurationService } from './services/api/bes3/remote-configuration.service';
import { ActivityRecordsService } from './services/api/bes3/activity-records.service';
import { EbikeRegistrationService } from './services/api/bes3/ebike-registration.service';
import { Bes3AchievementService } from './services/achievement/bes3/bes3-achievement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';

/**
 * Displays app component
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  //
  // Injections
  //

  /** Theme service */
  public themeService = inject(ThemeService);
  /** Overlay container */
  private overlayContainer = inject(OverlayContainer);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Meta service */
  private meta = inject(Meta);

  /** Snack bar */
  private snackbar = inject(MatSnackBar);
  /** Transloco service */
  private translocoService = inject(TranslocoService);

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
  /** Release management service */
  private releaseManagementService = inject(ReleaseManagementService);
  /** Remote configuration service */
  private remoteConfigurationService = inject(RemoteConfigurationService);
  /** Activity records service */
  public activityRecordsService = inject(ActivityRecordsService);
  // eBike Registration service */
  public registrationService = inject(EbikeRegistrationService);
  /** Achievement service */
  public achievementService = inject(Bes3AchievementService);

  /**
   * Constructor
   */
  constructor() {
    if (environment.mapbox.accessToken) {
      localStorage.setItem('mapboxAccessToken', environment.mapbox.accessToken);
    }
    if (environment.mapillary.accessToken) {
      localStorage.setItem(
        'mapillaryAccessToken',
        environment.mapillary.accessToken,
      );
    }

    effect(() => {
      // Theme menus and dialogs
      const overlayContainerClasses =
        this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter(
        (item: string) => item.includes('theme'),
      );
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(this.themeService.theme());

      switch (this.themeService.theme()) {
        case Theme.LIGHT: {
          this.meta.updateTag({ content: '#FFFFFF' }, 'name=theme-color');
          break;
        }
        case Theme.DARK: {
          this.meta.updateTag({ content: '#212121' }, 'name=theme-color');
          break;
        }
      }
    });

    // Handle initial load after login
    effect(() => {
      if (
        this.authenticationService.loggedIn() &&
        this.authenticationService.ebikeGeneration() == 'BES3'
      ) {
        this.ebikeProfileService.fetchAll().then(() => {
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
              this.releaseManagementService.fetch(bike.id);
              this.remoteConfigurationService.fetch(bike.id);
            });
          });
        });
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
        this.registrationService.fetchAll().then(() => {});
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
    await this.authenticationService.restoreConfig();
    this.initializeTheme();
  }

  //
  // Initialization
  //

  /**
   * Initializes theme
   */
  private initializeTheme() {
    this.overlayContainer
      .getContainerElement()
      .classList.add(this.themeService.theme());
  }
}
