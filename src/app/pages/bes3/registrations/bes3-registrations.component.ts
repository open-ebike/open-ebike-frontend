import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import {
  EbikeRegistrationService,
  Registration,
} from '../../../services/api/bes3/ebike-registration.service';
import { DatePipe } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { combineLatest, first } from 'rxjs';
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

/**
 * Displays registrations
 */
@Component({
  selector: 'app-bes3-registrations',
  imports: [
    TranslocoDirective,
    DatePipe,
    MatRipple,
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardSubtitle,
    MatCardTitle,
  ],
  templateUrl: './bes3-registrations.component.html',
  styleUrl: './bes3-registrations.component.scss',
  standalone: true,
})
export class Bes3RegistrationsComponent implements OnInit {
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
  /** eBike registration service */
  private ebikeRegistrationService = inject(EbikeRegistrationService);

  //
  // Signals
  //

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
    this.initializeRegistrations();
    this.handleQueryParameters();
  }

  //
  // Initialization
  //

  /**
   * Initializes eBike
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
