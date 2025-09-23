import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../services/theme.service';
import { AuthenticationService } from '../../services/authentication.service';
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
} from '../../services/api/ebike-profile.service';
import { combineLatest, first } from 'rxjs';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { ThousandsSeparatorPipe } from '../../pipes/thousands-separator.pipe';
import {
  CapacityTester,
  DiagnosisFieldDataService,
} from '../../services/api/diagnosis-field-data.service';
import { AttributeTreeComponent } from '../../components/attribute-tree/attribute-tree.component';

/**
 * Displays component details
 */
@Component({
  selector: 'app-component-details',
  imports: [
    TranslocoDirective,
    MatCardAvatar,
    RouterLink,
    MatButton,
    MatRipple,
    ThousandsSeparatorPipe,
    AttributeTreeComponent,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
  ],
  templateUrl: './component-details.component.html',
  styleUrl: './component-details.component.scss',
  standalone: true,
})
export class ComponentDetailsComponent implements OnInit {
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

  //
  // Signals
  //

  /** Signal providing eBike profile */
  ebikeProfile = signal<EbikeProfile | null>(null);
  serialNumber = signal<string | null>(null);
  partNumber = signal<string | null>(null);
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

  /** Language */
  lang = getBrowserLang();

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';
  /** Query parameter serial number */
  private QUERY_PARAM_SERIAL_NUMBER: string = 'serialNumber';
  /** Query parameter part number */
  private QUERY_PARAM_PART_NUMBER: string = 'partNumber';

  /**
   * Constructor
   */
  constructor() {
    this.route.params.subscribe((params) => {
      if (params['id'] == undefined && params['id'].length == 0) {
        this.router.navigate(['/ebikes']);
      }

      this.initializeEbike(params['id']);
    });

    effect(() => {
      if (this.serialNumber() != null && this.partNumber() != null) {
        if (
          this.ebikeProfile()?.driveUnit.serialNumber == this.serialNumber() &&
          this.ebikeProfile()?.driveUnit.partNumber == this.partNumber()
        ) {
          this.component.set(this.ebikeProfile()?.driveUnit);
          this.driveUnit.set(this.ebikeProfile()?.driveUnit);
          this.componentType.set('DRIVE_UNIT');
        } else if (
          this.ebikeProfile()?.remoteControl.serialNumber ==
            this.serialNumber() &&
          this.ebikeProfile()?.remoteControl.partNumber == this.partNumber()
        ) {
          this.component.set(this.ebikeProfile()?.remoteControl);
          this.componentType.set('REMOTE_CONTROL');
        } else if (
          this.ebikeProfile()?.batteries.find((battery) => {
            return (
              battery.serialNumber == this.serialNumber() &&
              battery.partNumber == this.partNumber()
            );
          })
        ) {
          this.component.set(
            this.ebikeProfile()?.batteries.find((battery) => {
              return (
                battery.serialNumber == this.serialNumber() &&
                battery.partNumber == this.partNumber()
              );
            }),
          );
          this.battery.set(
            this.ebikeProfile()?.batteries.find((battery) => {
              return (
                battery.serialNumber == this.serialNumber() &&
                battery.partNumber == this.partNumber()
              );
            }),
          );
          this.componentType.set('BATTERY');
        } else if (
          this.ebikeProfile()?.antiLockBrakeSystems.find(
            (antiLockBrakeSystem) => {
              return (
                antiLockBrakeSystem.serialNumber == this.serialNumber() &&
                antiLockBrakeSystem.partNumber == this.partNumber()
              );
            },
          )
        ) {
          this.component.set(
            this.ebikeProfile()?.antiLockBrakeSystems.find(
              (antiLockBrakeSystem) => {
                return (
                  antiLockBrakeSystem.serialNumber == this.serialNumber() &&
                  antiLockBrakeSystem.partNumber == this.partNumber()
                );
              },
            ),
          );
          this.componentType.set('ANTI_LOCK_BRAKE_SYSTEM');
        } else if (
          this.ebikeProfile()?.connectModule.serialNumber ==
            this.serialNumber() &&
          this.ebikeProfile()?.connectModule.partNumber == this.partNumber()
        ) {
          this.component.set(this.ebikeProfile()?.connectModule);
          this.componentType.set('CONNECT_MODULE');
        } else if (
          this.ebikeProfile()?.headUnit.serialNumber == this.serialNumber() &&
          this.ebikeProfile()?.headUnit.partNumber == this.partNumber()
        ) {
          this.component.set(this.ebikeProfile()?.headUnit);
          this.componentType.set('HEAD_UNIT');
        }
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
    this.initializeTheme();
    this.handleQueryParameters();
  }

  //
  // Initialization
  //

  /**
   * Initializes theme
   */
  private initializeTheme() {
    switch (this.themeService.theme()) {
      case Theme.LIGHT: {
        this.updateQueryParameters();
        break;
      }
      case Theme.DARK: {
        this.updateQueryParameters();
        break;
      }
    }
  }

  /**
   * Initializes eBike
   */
  private initializeEbike(bikeId: string) {
    this.ebikeProfileService.getBike(bikeId).subscribe((eBikeProfile) => {
      this.ebikeProfile.set(eBikeProfile);
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
