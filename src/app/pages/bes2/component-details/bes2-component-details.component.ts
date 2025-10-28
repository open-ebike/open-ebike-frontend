import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  Battery,
  ComponentType,
  DriveUnit,
  EbikeProfile,
  EbikeProfileService,
  HeadUnit,
} from '../../../services/api/bes2/ebike-profile.service';
import { combineLatest, first } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  DiagnosisEventService,
  Event,
} from '../../../services/api/bes2/diagnosis-event.service';
import { MatRipple } from '@angular/material/core';
import {
  BatteryFieldData,
  CapacityTesterFieldData,
  DiagnosisFieldDataService,
  DriveUnitFieldData,
} from '../../../services/api/bes2/diagnosis-field-data.service';
import { AttributeTreeComponent } from '../../../components/attribute-tree/attribute-tree.component';
import { MatButton } from '@angular/material/button';

/**
 * Displays component details
 */
@Component({
  selector: 'app-component-details',
  imports: [
    TranslocoDirective,
    RouterLink,
    DatePipe,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardAvatar,
    MatCardContent,
    MatCardActions,
    MatCardFooter,
    MatRipple,
    AttributeTreeComponent,
    MatButton,
  ],
  templateUrl: './bes2-component-details.component.html',
  styleUrl: './bes2-component-details.component.scss',
  standalone: true,
})
export class Bes2ComponentDetailsComponent implements OnInit {
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
  /** Diagnosis event service */
  private diagnosisEventService = inject(DiagnosisEventService);
  /** Diagnosis field data service */
  private diagnosisFieldDataService = inject(DiagnosisFieldDataService);

  //
  // Signals
  //

  duPartNumber = signal<string | undefined>(undefined);
  duSerialNumber = signal<string | undefined>(undefined);
  partNumber = signal<string | undefined>(undefined);
  serialNumber = signal<string | undefined>(undefined);

  /** Signal providing eBike profile */
  ebikeProfile = signal<EbikeProfile | undefined>(undefined);

  component = signal<DriveUnit | Battery | HeadUnit | undefined>(undefined);
  driveUnit = signal<DriveUnit | undefined>(undefined);
  headUnit = signal<HeadUnit | undefined>(undefined);
  battery = signal<Battery | undefined>(undefined);
  componentType = signal<ComponentType | undefined>(undefined);

  /** Signal providing tuning resets */
  tuningResetEvents = signal<Event[]>([]);
  /** Signal providing battery deactivations */
  batteryDeactivationEvents = signal<Event[]>([]);
  /** Signal providing lock reset */
  lockResetEvents = signal<Event[]>([]);

  /** Signal providing battery management field data */
  batteryMeasurementFieldData = signal<CapacityTesterFieldData[]>([]);
  /** Signal providing battery field data */
  batteryFieldData = signal<BatteryFieldData[]>([]);
  /** Signal providing drive unit field data */
  driveUnitFieldData = signal<DriveUnitFieldData[]>([]);

  /** Language */
  lang = getBrowserLang();

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';
  /** Query parameter drive unit part number */
  private QUERY_PARAM_DU_PART_NUMBER: string = 'duPartNumber';
  /** Query parameter drive unit serial number */
  private QUERY_PARAM_DU_SERIAL_NUMBER: string = 'duSerialNumber';
  /** Query parameter part number */
  private QUERY_PARAM_PART_NUMBER: string = 'partNumber';
  /** Query parameter serial number */
  private QUERY_PARAM_SERIAL_NUMBER: string = 'serialNumber';

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      if (
        this.duPartNumber() != undefined &&
        this.duSerialNumber() != undefined
      ) {
        this.initializeEbike(this.duPartNumber(), this.duSerialNumber());
      }
    });

    effect(() => {
      if (
        this.ebikeProfile() != undefined &&
        this.partNumber() != undefined &&
        this.serialNumber() != undefined
      ) {
        this.initializeComponent(
          this.ebikeProfile(),
          this.duPartNumber(),
          this.duSerialNumber(),
        );

        this.initializeTuningResetEvents(
          this.duPartNumber(),
          this.duSerialNumber(),
        );
        this.initializeBatteryDeactivationEvents(
          this.duPartNumber(),
          this.duSerialNumber(),
        );
        this.initializeLockResetEvents(
          this.duPartNumber(),
          this.duSerialNumber(),
        );

        this.initializeBatteryMeasurementFieldData(
          this.duPartNumber(),
          this.duSerialNumber(),
        );
        this.initializeBatteryFieldData(
          this.duPartNumber(),
          this.duSerialNumber(),
        );
        this.initializeDriveUnitFieldData(
          this.duPartNumber(),
          this.duSerialNumber(),
        );
      }
    });

    effect(() => {
      if (
        this.duPartNumber() == undefined ||
        this.duSerialNumber() == undefined ||
        this.partNumber() == undefined ||
        this.serialNumber() == undefined
      ) {
        this.router.navigate(['/bes2/ebikes']);
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
   * @param duPartNumber drive unit part number
   * @param duSerialNumber drive unit serial number
   */
  private initializeEbike(duPartNumber?: string, duSerialNumber?: string) {
    this.ebikeProfileService
      .getAllBikes(duPartNumber, duSerialNumber)
      .subscribe((eBikeProfiles) => {
        if (eBikeProfiles.bikes.length == 1) {
          this.ebikeProfile.set(eBikeProfiles.bikes[0]);
        }
      });
  }

  /**
   * Initializes component
   * @param ebikeProfile eBike profile
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private initializeComponent(
    ebikeProfile?: EbikeProfile,
    partNumber?: string,
    serialNumber?: string,
  ) {
    if (
      ebikeProfile?.driveUnit.serialNumber == serialNumber &&
      ebikeProfile?.driveUnit.partNumber == partNumber
    ) {
      this.component.set(ebikeProfile?.driveUnit);
      this.driveUnit.set(ebikeProfile?.driveUnit);
      this.componentType.set('DRIVE_UNIT');
    } else if (
      this.ebikeProfile()?.headUnits.find((headUnit) => {
        return (
          headUnit.serialNumber == this.duSerialNumber() &&
          headUnit.partNumber == this.duPartNumber()
        );
      })
    ) {
      this.component.set(
        this.ebikeProfile()?.headUnits.find((headUnit) => {
          return (
            headUnit.serialNumber == this.duSerialNumber() &&
            headUnit.partNumber == this.duPartNumber()
          );
        }),
      );
      this.headUnit.set(
        this.ebikeProfile()?.headUnits.find((headUnit) => {
          return (
            headUnit.serialNumber == this.duSerialNumber() &&
            headUnit.partNumber == this.duPartNumber()
          );
        }),
      );
      this.componentType.set('HEAD_UNIT');
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
    }
  }

  /**
   * Initializes tuning events
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private initializeTuningResetEvents(
    partNumber?: string,
    serialNumber?: string,
  ) {
    this.diagnosisEventService
      .getAllTuningResetEvents(partNumber, serialNumber)
      .subscribe((tuningResets) => {
        this.tuningResetEvents.set(tuningResets.tuningResets);
      });
  }

  /**
   * Initializes battery deactivation events
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private initializeBatteryDeactivationEvents(
    partNumber?: string,
    serialNumber?: string,
  ) {
    this.diagnosisEventService
      .getAllBatteryDeactivationEvents(partNumber, serialNumber)
      .subscribe((batteryDeactivations) => {
        this.batteryDeactivationEvents.set(
          batteryDeactivations.batteryDeactivations,
        );
      });
  }

  /**
   * Initializes lock reset events
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private initializeLockResetEvents(
    partNumber?: string,
    serialNumber?: string,
  ) {
    this.diagnosisEventService
      .getAllLockResetEvents(partNumber, serialNumber)
      .subscribe((lockResets) => {
        this.lockResetEvents.set(lockResets.lockResets);
      });
  }

  /**
   * Initializes battery measurement field data
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private initializeBatteryMeasurementFieldData(
    partNumber?: string,
    serialNumber?: string,
  ) {
    this.diagnosisFieldDataService
      .getAllBatteryMeasurementFieldData(partNumber, serialNumber)
      .subscribe((batteryMeasurementFieldData) => {
        this.batteryMeasurementFieldData.set(
          batteryMeasurementFieldData.capacityTesters,
        );
      });
  }

  /**
   * Initializes battery field data
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private initializeBatteryFieldData(
    partNumber?: string,
    serialNumber?: string,
  ) {
    this.diagnosisFieldDataService
      .getAllBatteryFieldData(partNumber, serialNumber)
      .subscribe((batteryFieldData) => {
        this.batteryFieldData.set(batteryFieldData.batteries);
      });
  }

  /**
   * Initializes drive unit field data
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private initializeDriveUnitFieldData(
    partNumber?: string,
    serialNumber?: string,
  ) {
    this.diagnosisFieldDataService
      .getAllDriveUnitFieldData(partNumber, serialNumber)
      .subscribe((driveUnitFieldData) => {
        this.driveUnitFieldData.set(driveUnitFieldData.driveUnits);
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
        const duPartNumber = queryParams[this.QUERY_PARAM_DU_PART_NUMBER];
        const duSerialNumber = queryParams[this.QUERY_PARAM_DU_SERIAL_NUMBER];
        const partNumber = queryParams[this.QUERY_PARAM_PART_NUMBER];
        const serialNumber = queryParams[this.QUERY_PARAM_SERIAL_NUMBER];

        this.themeService.switchTheme(theme ? theme : Theme.LIGHT);
        this.duPartNumber.set(duPartNumber);
        this.duSerialNumber.set(duSerialNumber);
        this.partNumber.set(partNumber);
        this.serialNumber.set(serialNumber);
        this.updateQueryParameters();
      });
  }

  //
  // Helpers
  //

  /**
   * Updates query parameters
   */
  private updateQueryParameters() {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {
          [this.QUERY_PARAM_THEME]: this.themeService.theme(),
          [this.QUERY_PARAM_DU_SERIAL_NUMBER]: this.duSerialNumber(),
          [this.QUERY_PARAM_DU_PART_NUMBER]: this.duPartNumber(),
          [this.QUERY_PARAM_SERIAL_NUMBER]: this.serialNumber(),
          [this.QUERY_PARAM_PART_NUMBER]: this.partNumber(),
        },
      })
      .then();
  }
}
