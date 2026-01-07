import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme, ThemeService } from './services/theme.service';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { environment } from '../environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { Meta } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { EbikeProfileService as Bes3EbikeProfileService } from './services/api/bes3/ebike-profile.service';
import { BikePassService as Bes3BikePassService } from './services/api/bes3/bike-pass.service';
import { BulkConfigurationService as Bes3BulkConfigurationService } from './services/api/bes3/bulk-configuration.service';
import { DiagnosisFieldDataService as Bes3DiagnosisFieldDataService } from './services/api/bes3/diagnosis-field-data.service';
import { DigitalServiceBookService as Bes3DigitalServiceBookService } from './services/api/bes3/digital-service-book.service';
import { ReleaseManagementService as Bes3ReleaseManagementService } from './services/api/bes3/release-management.service';
import { RemoteConfigurationService as Bes3RemoteConfigurationService } from './services/api/bes3/remote-configuration.service';
import { ActivityRecordsService as Bes3ActivityRecordsService } from './services/api/bes3/activity-records.service';
import { EbikeRegistrationService as Bes3EbikeRegistrationService } from './services/api/bes3/ebike-registration.service';
import { Bes3AchievementService } from './services/achievement/bes3/bes3-achievement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom, map } from 'rxjs';
import { Bes3YearlyAchievementService } from './services/yearly-achievement/bes3/bes3-yearly-achievement.service';
import { ActivityService as Bes2ActivityService } from './services/api/bes2/activity.service';
import { EbikeProfileService as Bes2EbikeProfileService } from './services/api/bes2/ebike-profile.service';
import { DiagnosisEventService as Bes2DiagnosisEventService } from './services/api/bes2/diagnosis-event.service';
import { DiagnosisFieldDataService as Bes2DiagnosisFieldDataService } from './services/api/bes2/diagnosis-field-data.service';
import { ReleaseManagementService as Bes2ReleaseManagementService } from './services/api/bes2/release-management.service';
import { RemoteConfigurationService as Bes2RemoteConfigurationService } from './services/api/bes2/remote-configuration.service';
import { Bes2AchievementService } from './services/achievement/bes2/bes2-achievement.service';
import { Bes2YearlyAchievementService } from './services/yearly-achievement/bes2/bes2-yearly-achievement.service';
import { HubService as CobiHubService } from './services/api/cobi/hub.service';
import { ActivityService as CobiActivityService } from './services/api/cobi/activity.service';

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
  private bes3EbikeProfileService = inject(Bes3EbikeProfileService);
  /** Bike pass service */
  private bes3BikePassService = inject(Bes3BikePassService);
  /** Bulk configuration service */
  private bes3BulkConfigurationService = inject(Bes3BulkConfigurationService);
  /** Diagnosis field data service */
  private bes3DiagnosisFieldDataService = inject(Bes3DiagnosisFieldDataService);
  /** Digital service book service */
  private bes3DigitalServiceBookService = inject(Bes3DigitalServiceBookService);
  /** Release management service */
  private bes3ReleaseManagementService = inject(Bes3ReleaseManagementService);
  /** Remote configuration service */
  private bes3RemoteConfigurationService = inject(
    Bes3RemoteConfigurationService,
  );
  /** Activity records service */
  private bes3ActivityRecordsService = inject(Bes3ActivityRecordsService);
  /** eBike Registration service */
  private bes3RegistrationService = inject(Bes3EbikeRegistrationService);
  /** Achievement service */
  private bes3AchievementService = inject(Bes3AchievementService);
  /** Yearly achievement service */
  private bes3YearlyAchievementService = inject(Bes3YearlyAchievementService);

  /** eBike profile service */
  private bes2EbikeProfileService = inject(Bes2EbikeProfileService);
  /** Diagnosis event service */
  private bes2DiagnosisEventService = inject(Bes2DiagnosisEventService);
  /** Diagnosis field data service */
  private bes2DiagnosisFieldDataService = inject(Bes2DiagnosisFieldDataService);
  /** Release management service */
  private bes2ReleaseManagementService = inject(Bes2ReleaseManagementService);
  /** Remote configuration service */
  private bes2RemoteConfigurationService = inject(
    Bes2RemoteConfigurationService,
  );
  /** Activity service */
  private bes2ActivityService = inject(Bes2ActivityService);
  /** Achievement service */
  private bes2AchievementService = inject(Bes2AchievementService);
  /** Yearly achievement service */
  private bes2YearlyAchievementService = inject(Bes2YearlyAchievementService);

  /** Hub service */
  private cobiHubService = inject(CobiHubService);
  /** Activity service */
  private cobiActivityService = inject(CobiActivityService);

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

    // Handle theme switch
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

    // Handle initial load after login (BES3)
    effect(() => {
      if (
        this.authenticationService.loggedIn() &&
        this.authenticationService.ebikeGeneration() == 'BES3'
      ) {
        this.bes3EbikeProfileService.fetchAll().then(() => {
          this.bes3EbikeProfileService.getAllBikes().subscribe((bikes) => {
            bikes.bikes.forEach((bike) => {
              this.bes3BikePassService.fetch(bike.id);
              this.bes3BulkConfigurationService.fetch(bike.id);
              this.bes3DiagnosisFieldDataService.fetch(
                bike.driveUnit?.partNumber,
                bike.driveUnit?.serialNumber,
              );
              this.bes3DiagnosisFieldDataService.fetch(
                bike.remoteControl?.partNumber,
                bike.remoteControl?.serialNumber,
              );
              bike.batteries?.forEach((battery) => {
                this.bes3DiagnosisFieldDataService.fetch(
                  battery?.partNumber,
                  battery?.serialNumber,
                );
              });
              bike.antiLockBrakeSystems?.forEach((antiLockBrakeSystem) => {
                this.bes3DiagnosisFieldDataService.fetch(
                  antiLockBrakeSystem?.partNumber,
                  antiLockBrakeSystem?.serialNumber,
                );
              });
              if (bike.connectModule) {
                this.bes3DiagnosisFieldDataService.fetch(
                  bike.connectModule?.partNumber,
                  bike.connectModule?.serialNumber,
                );
              }
              if (bike.headUnit) {
                this.bes3DiagnosisFieldDataService.fetch(
                  bike.headUnit?.partNumber,
                  bike.headUnit?.serialNumber,
                );
              }
              this.bes3DigitalServiceBookService.fetch(bike.id);
              this.bes3ReleaseManagementService.fetch(bike.id);
              this.bes3RemoteConfigurationService.fetch(bike.id);
            });
          });
        });
        this.bes3ActivityRecordsService.fetchAll().then((success) => {
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
        this.bes3RegistrationService.fetchAll().then(() => {});
      }
    });

    // Handle initial load after login (BES2)
    effect(() => {
      if (
        this.authenticationService.loggedIn() &&
        this.authenticationService.ebikeGeneration() == 'BES2'
      ) {
        this.bes2EbikeProfileService.fetchAll().then(() => {
          this.bes2EbikeProfileService.getAllBikes().subscribe((bikes) => {
            bikes?.bikes.forEach((bike) => {
              this.bes2DiagnosisEventService.fetch(
                bike.driveUnit.partNumber,
                bike.driveUnit.serialNumber,
              );
              this.bes2DiagnosisFieldDataService.fetch(
                bike.driveUnit.partNumber,
                bike.driveUnit.serialNumber,
              );
              this.bes2ReleaseManagementService.fetch(
                bike.driveUnit.partNumber,
                bike.driveUnit.serialNumber,
              );
              this.bes2RemoteConfigurationService.fetch(
                bike.driveUnit.partNumber,
                bike.driveUnit.serialNumber,
              );
            });
          });
        });
        this.bes2ActivityService.fetchAll().then((success) => {
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

    // Handle initial load after login (BES2)
    effect(() => {
      if (
        this.authenticationService.loggedIn() &&
        this.authenticationService.ebikeGeneration() == 'COBI'
      ) {
        this.cobiHubService.fetchAll();
        this.cobiActivityService.fetchAll();
      }
    });

    // Handle achievement evaluation after required data is loaded (BES3)
    effect(() => {
      if (
        this.bes3EbikeProfileService.loaded() &&
        this.bes3ActivityRecordsService.loaded() &&
        this.bes3BikePassService.loaded() &&
        this.bes3RegistrationService.loaded()
      ) {
        // Retrieve data of first activity
        firstValueFrom(
          this.bes3ActivityRecordsService.getAllActivitySummaries(1, 0).pipe(
            map((activitySummaries) => {
              return activitySummaries.activitySummaries.length > 0
                ? new Date(activitySummaries.activitySummaries[0].startTime)
                : new Date();
            }),
          ),
        ).then((firstActivityDate) => {
          this.bes3AchievementService.initialize(firstActivityDate);
          this.bes3AchievementService.evaluate();
        });
      }
    });

    // Handle yearly achievement evaluation after required data is loaded (BES3)
    effect(() => {
      if (this.bes3ActivityRecordsService.loaded()) {
        // Retrieve data of first activity
        firstValueFrom(
          this.bes3ActivityRecordsService.getAllActivitySummaries(1, 0).pipe(
            map((activitySummaries) => {
              return activitySummaries.activitySummaries.length > 0
                ? new Date(activitySummaries.activitySummaries[0].startTime)
                : new Date();
            }),
          ),
        ).then((firstActivityDate) => {
          this.bes3YearlyAchievementService.initialize(firstActivityDate);
          this.bes3YearlyAchievementService.evaluate();
        });
      }
    });

    // Handle achievement evaluation after required data is loaded (BES2)
    effect(() => {
      if (this.bes2ActivityService.loaded()) {
        // Retrieve data of first activity
        firstValueFrom(
          this.bes2ActivityService.getAllActivitySummaries(1, 0).pipe(
            map((activitySummaries) => {
              return activitySummaries.activities.length > 0
                ? new Date(activitySummaries.activities[0].startTime)
                : new Date();
            }),
          ),
        ).then((firstActivityDate) => {
          this.bes2AchievementService.initialize(firstActivityDate);
          this.bes2AchievementService.evaluate();
        });
      }
    });

    // Handle yearly achievement evaluation after required data is loaded (BES2)
    effect(() => {
      if (this.bes2ActivityService.loaded()) {
        // Retrieve data of first activity
        firstValueFrom(
          this.bes2ActivityService.getAllActivitySummaries(1, 0).pipe(
            map((activitySummaries) => {
              return activitySummaries.activities.length > 0
                ? new Date(activitySummaries.activities[0].startTime)
                : new Date();
            }),
          ),
        ).then((firstActivityDate) => {
          this.bes2YearlyAchievementService.initialize(firstActivityDate);
          this.bes2YearlyAchievementService.evaluate();
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
