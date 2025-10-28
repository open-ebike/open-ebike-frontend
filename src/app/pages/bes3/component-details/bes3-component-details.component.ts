import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  AntiLockBrakeSystem,
  Battery,
  ComponentType,
  ConnectModule,
  DriveUnit,
  EbikeProfile,
  EbikeProfileService,
  HeadUnit,
  RemoteControl,
} from '../../../services/api/bes3/ebike-profile.service';
import { combineLatest, first } from 'rxjs';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { ThousandsSeparatorPipe } from '../../../pipes/thousands-separator.pipe';
import {
  CapacityTester,
  DiagnosisFieldDataService,
} from '../../../services/api/bes3/diagnosis-field-data.service';
import { AttributeTreeComponent } from '../../../components/attribute-tree/attribute-tree.component';
import {
  EbikeRegistrationService,
  Registration,
} from '../../../services/api/bes3/ebike-registration.service';

/**
 * Displays component details
 */
@Component({
  selector: 'app-component-details',
  imports: [
    TranslocoDirective,
    MatCardAvatar,
    RouterLink,
    ThousandsSeparatorPipe,
    AttributeTreeComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
  ],
  templateUrl: './bes3-component-details.component.html',
  styleUrl: './bes3-component-details.component.scss',
  standalone: true,
})
export class Bes3ComponentDetailsComponent implements OnInit {
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
  /** eBike profile service */
  private ebikeProfileService = inject(EbikeProfileService);
  /** Diagnosis field data service */
  private diagnosisFieldDataService = inject(DiagnosisFieldDataService);
  /** eBike registration service */
  private ebikeRegistrationService = inject(EbikeRegistrationService);

  //
  // Signals
  //

  serialNumber = signal<string | undefined>(undefined);
  partNumber = signal<string | undefined>(undefined);

  /** Signal providing eBike profile */
  ebikeProfile = signal<EbikeProfile | undefined>(undefined);

  component = signal<
    | DriveUnit
    | RemoteControl
    | Battery
    | AntiLockBrakeSystem
    | ConnectModule
    | HeadUnit
    | undefined
  >(undefined);
  driveUnit = signal<DriveUnit | undefined>(undefined);
  battery = signal<Battery | undefined>(undefined);
  componentType = signal<ComponentType | undefined>(undefined);
  capacityTesters = signal<CapacityTester[]>([]);
  /** Signal providing registrations */
  registrations = signal<Registration[]>([]);

  /** Language */
  lang = getBrowserLang();

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';
  /** Query parameter part number */
  private QUERY_PARAM_PART_NUMBER: string = 'partNumber';
  /** Query parameter serial number */
  private QUERY_PARAM_SERIAL_NUMBER: string = 'serialNumber';

  /**
   * Constructor
   */
  constructor() {
    this.route.params.subscribe((params) => {
      if (params['id'] == undefined && params['id'].length == 0) {
        this.router.navigate(['/bes3/ebikes']);
      }

      this.initializeEbike(params['id']);
      this.initializeRegistrations();
    });

    effect(() => {
      if (
        this.ebikeProfile() != null &&
        this.serialNumber() != null &&
        this.partNumber() != null
      ) {
        this.initializeComponent(
          this.ebikeProfile(),
          this.serialNumber(),
          this.partNumber(),
        );
      }
    });

    effect(() => {
      if (
        this.component()?.serialNumber != null &&
        this.component()?.partNumber != null
      ) {
        this.initializeCapacityTesters(
          // @ts-ignore
          this.component()?.serialNumber,
          this.component()?.partNumber,
        );
      }
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
   * Initializes component
   * @param ebikeProfile eBike profile
   * @param serialNumber serial number
   * @param partNumber part number
   */
  private initializeComponent(
    ebikeProfile?: EbikeProfile,
    serialNumber?: string,
    partNumber?: string,
  ) {
    if (
      ebikeProfile?.driveUnit.serialNumber == serialNumber &&
      ebikeProfile?.driveUnit.partNumber == partNumber
    ) {
      this.component.set(ebikeProfile?.driveUnit);
      this.driveUnit.set(ebikeProfile?.driveUnit);
      this.componentType.set('DRIVE_UNIT');
    } else if (
      ebikeProfile?.remoteControl.serialNumber == serialNumber &&
      ebikeProfile?.remoteControl.partNumber == partNumber
    ) {
      this.component.set(ebikeProfile?.remoteControl);
      this.componentType.set('REMOTE_CONTROL');
    } else if (
      ebikeProfile?.batteries.find((battery) => {
        return (
          battery.serialNumber == serialNumber &&
          battery.partNumber == partNumber
        );
      })
    ) {
      this.component.set(
        ebikeProfile?.batteries.find((battery) => {
          return (
            battery.serialNumber == serialNumber &&
            battery.partNumber == partNumber
          );
        }),
      );
      this.battery.set(
        ebikeProfile?.batteries.find((battery) => {
          return (
            battery.serialNumber == serialNumber &&
            battery.partNumber == partNumber
          );
        }),
      );
      this.componentType.set('BATTERY');
    } else if (
      ebikeProfile?.antiLockBrakeSystems.find((antiLockBrakeSystem) => {
        return (
          antiLockBrakeSystem.serialNumber == serialNumber &&
          antiLockBrakeSystem.partNumber == partNumber
        );
      })
    ) {
      this.component.set(
        ebikeProfile?.antiLockBrakeSystems.find((antiLockBrakeSystem) => {
          return (
            antiLockBrakeSystem.serialNumber == serialNumber &&
            antiLockBrakeSystem.partNumber == partNumber
          );
        }),
      );
      this.componentType.set('ANTI_LOCK_BRAKE_SYSTEM');
    } else if (
      ebikeProfile?.connectModule.serialNumber == serialNumber &&
      ebikeProfile?.connectModule.partNumber == partNumber
    ) {
      this.component.set(ebikeProfile?.connectModule);
      this.componentType.set('CONNECT_MODULE');
    } else if (
      ebikeProfile?.headUnit.serialNumber == serialNumber &&
      ebikeProfile?.headUnit.partNumber == partNumber
    ) {
      this.component.set(ebikeProfile?.headUnit);
      this.componentType.set('HEAD_UNIT');
    }
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
   * Initializes capacity testers
   */
  private initializeCapacityTesters(partNumber: string, serialNumber: string) {
    this.diagnosisFieldDataService
      .getFieldData(partNumber, serialNumber)
      .subscribe((capacityTesters) => {
        this.capacityTesters.set(capacityTesters.capacityTesters);
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
        const serialNumber = queryParams[this.QUERY_PARAM_SERIAL_NUMBER];
        const partNumber = queryParams[this.QUERY_PARAM_PART_NUMBER];

        this.themeService.switchTheme(theme ? theme : Theme.LIGHT);
        this.serialNumber.set(serialNumber);
        this.partNumber.set(partNumber);
        this.updateQueryParameters();
      });
  }

  //
  // Helpers
  //

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
          [this.QUERY_PARAM_SERIAL_NUMBER]: this.serialNumber(),
          [this.QUERY_PARAM_PART_NUMBER]: this.partNumber(),
        },
      })
      .then();
  }
}
