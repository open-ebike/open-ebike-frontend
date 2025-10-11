import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  EbikeProfile,
  EbikeProfileService,
} from '../../../services/api/bes3/ebike-profile.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
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
  BikePass,
  BikePassService,
} from '../../../services/api/bes3/bike-pass.service';
import {
  BulkConfigurationService,
  BulkInstallationReport,
} from '../../../services/api/bes3/bulk-configuration.service';
import { AttributeTreeComponent } from '../../../components/attribute-tree/attribute-tree.component';
import {
  DigitalServiceBookService,
  ServiceRecord,
} from '../../../services/api/bes3/digital-service-book.service';
import {
  Case,
  RemoteConfigurationService,
} from '../../../services/api/bes3/remote-configuration.service';
import {
  InstallationReport,
  ReleaseManagementService,
} from '../../../services/api/bes3/release-management.service';
import {
  EbikeRegistrationService,
  Registration,
} from '../../../services/api/bes3/ebike-registration.service';
import { MatButton } from '@angular/material/button';

/**
 * Displays eBike details
 */
@Component({
  selector: 'app-ebike-details',
  imports: [
    TranslocoDirective,
    MatCardAvatar,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatRipple,
    MatCardContent,
    MatCardFooter,
    MatCardActions,
    DatePipe,
    AttributeTreeComponent,
    RouterLink,
    MatButton,
  ],
  templateUrl: './bes3-ebike-details.component.html',
  styleUrl: './bes3-ebike-details.component.scss',
  standalone: true,
})
export class Bes3EbikeDetailsComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** eBike profile service */
  private ebikeProfileService = inject(EbikeProfileService);
  /** Bike pass service */
  private bikePassService = inject(BikePassService);
  /** Bulk configuration service */
  private bulkConfigurationService = inject(BulkConfigurationService);
  /** Digital service book service */
  private digitalServiceBookService = inject(DigitalServiceBookService);
  /** Remote configuration service */
  private remoteConfigurationService = inject(RemoteConfigurationService);
  /** Release management service */
  private releaseManagementService = inject(ReleaseManagementService);
  /** eBike registration service */
  private ebikeRegistrationService = inject(EbikeRegistrationService);

  //
  // Signals
  //

  /** Signal providing eBike profile */
  ebikeProfile = signal<EbikeProfile | null>(null);
  /** Signal providing bike passes */
  bikePasses = signal<BikePass[] | null>([]);
  /** Signal providing bulk installation reports */
  bulkInstallationReports = signal<BulkInstallationReport[] | null>([]);
  /** Signal providing service records */
  serviceRecords = signal<ServiceRecord[] | null>([]);
  /** Signal providing remote configuration cases */
  remoteConfigurationCases = signal<Case[] | null>([]);
  /** Signal providing installation reports */
  installationReports = signal<InstallationReport[] | null>([]);
  /** Signal providing registrations */
  registrations = signal<Registration[]>([]);

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
      if (params['id'] == undefined && params['id'].length == 0) {
        this.router.navigate(['/bes3/ebikes']);
      }

      this.initializeEbike(params['id']);
      this.initializeBikePasses(params['id']);
      this.initializeBulkInstallationReports(params['id']);
      this.initializeServiceRecords(params['id']);
      this.initializeRemoteConfigurationCases(params['id']);
      this.initializeInstallationReports(params['id']);

      this.initializeRegistrations();
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
   * Initializes eBike
   */
  private initializeEbike(bikeId: string) {
    this.ebikeProfileService.getBike(bikeId).subscribe((eBikeProfile) => {
      this.ebikeProfile.set(eBikeProfile);
    });
  }

  /**
   * Initializes bike passes
   */
  private initializeBikePasses(bikeId: string) {
    this.bikePassService.getBikePasses(bikeId).subscribe((bikePasses) => {
      this.bikePasses.set(bikePasses.bikePasses);
    });
  }

  /**
   * Initializes bulk installation reports
   */
  private initializeBulkInstallationReports(bikeId: string) {
    this.bulkConfigurationService
      .getInstallationReports(bikeId)
      .subscribe((installationReports) => {
        this.bulkInstallationReports.set(
          installationReports.installationReports,
        );
      });
  }

  /**
   * Initializes service records
   */
  private initializeServiceRecords(bikeId: string) {
    this.digitalServiceBookService
      .getServiceRecords(bikeId)
      .subscribe((serviceRecords) => {
        this.serviceRecords.set(serviceRecords.serviceRecords);
      });
  }

  /**
   * Initializes remote configuration cases
   */
  private initializeRemoteConfigurationCases(bikeId: string) {
    this.remoteConfigurationService
      .getRemoteConfigurationCases(bikeId)
      .subscribe((remoteConfigurationCases) => {
        this.remoteConfigurationCases.set(remoteConfigurationCases.cases);
      });
  }

  /**
   * Initializes installation reports
   */
  private initializeInstallationReports(bikeId: string) {
    this.releaseManagementService
      .getInstallationReports(bikeId)
      .subscribe((installationReports) => {
        this.installationReports.set(installationReports.installationReports);
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
  // Helpers
  //

  /**
   * Determines if an ebike is registered
   * @param bikeId bike ID
   */
  isEbikeRegistered(bikeId: string | undefined) {
    return this.registrations().find(
      (registration) => registration.bikeRegistration?.bikeId === bikeId,
    );
  }

  /**
   * Determines if a component is registered
   * @param partNumber part number
   * @param serialNumber serial number
   */
  isComponentRegistered(
    partNumber: string | undefined,
    serialNumber: string | undefined,
  ) {
    return this.registrations().find(
      (registration) =>
        registration.componentRegistration?.partNumber === partNumber &&
        registration.componentRegistration?.serialNumber === serialNumber,
    );
  }

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
