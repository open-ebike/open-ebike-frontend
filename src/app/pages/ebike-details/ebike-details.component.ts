import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EbikeProfile,
  EbikeProfileService,
} from '../../services/api/ebike-profile.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { Theme, ThemeService } from '../../services/theme.service';
import { AuthenticationService } from '../../services/authentication.service';
import { combineLatest, first } from 'rxjs';
import { MatCardAvatar } from '@angular/material/card';

/**
 * Displays eBike details
 */
@Component({
  selector: 'app-ebike-details',
  imports: [TranslocoDirective, MatCardAvatar],
  templateUrl: './ebike-details.component.html',
  styleUrl: './ebike-details.component.scss',
  standalone: true,
})
export class EbikeDetailsComponent implements OnInit {
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

  //
  // Signals
  //

  /** eBike ID */
  id = signal<string>('');
  /** Signal providing eBike profile */
  ebikeProfile = signal<EbikeProfile | null>(null);

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
        this.router.navigate(['/ebikes']);
      }

      this.initializeEbike(params['id']);
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
