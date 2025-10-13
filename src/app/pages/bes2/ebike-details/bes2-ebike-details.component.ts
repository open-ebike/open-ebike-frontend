import { Component, inject, OnInit, signal } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
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
import { MatButton } from '@angular/material/button';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  EbikeProfile,
  EbikeProfileService,
} from '../../../services/api/bes2/ebike-profile.service';
import { combineLatest, first } from 'rxjs';

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
    MatCardActions,
    RouterLink,
    MatButton,
  ],
  templateUrl: './bes2-ebike-details.component.html',
  styleUrl: './bes2-ebike-details.component.scss',
  standalone: true,
})
export class Bes2EbikeDetailsComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** eBike profile service */
  private ebikeProfileService = inject(EbikeProfileService);

  //
  // Signals
  //

  /** Signal providing eBike profile */
  ebikeProfile = signal<EbikeProfile | null>(null);

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
  private initializeEbike(duPartNumber: string, duSerialNumber: string) {
    this.ebikeProfileService
      .getAllBikes(duPartNumber, duSerialNumber)
      .subscribe((eBikeProfiles) => {
        if (eBikeProfiles.bikes.length == 1) {
          this.ebikeProfile.set(eBikeProfiles.bikes[0]);
        }
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

        this.themeService.switchTheme(theme ? theme : Theme.LIGHT);
        this.initializeEbike(duPartNumber, duSerialNumber);
      });
  }
}
