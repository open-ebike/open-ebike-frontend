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
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

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
      if (this.duPartNumber() != null && this.duSerialNumber() != null) {
        this.initializeEbike(this.duPartNumber(), this.duSerialNumber());
      }
    });

    effect(() => {
      if (
        this.ebikeProfile() != null &&
        this.partNumber() != null &&
        this.serialNumber() != null
      ) {
        this.initializeComponent(
          this.ebikeProfile(),
          this.duPartNumber(),
          this.duSerialNumber(),
        );
      }
    });

    effect(() => {
      if (
        this.duPartNumber() == null ||
        this.duSerialNumber() == null ||
        this.partNumber() == null ||
        this.serialNumber() == null
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
