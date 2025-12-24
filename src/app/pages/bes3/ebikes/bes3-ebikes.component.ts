import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
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
  ],
  templateUrl: './bes3-ebikes.component.html',
  styleUrl: './bes3-ebikes.component.scss',
  standalone: true,
})
export class Bes3EbikesComponent implements OnInit {
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
