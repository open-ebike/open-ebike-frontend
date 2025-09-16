import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../services/theme.service';
import { AuthenticationService } from '../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { combineLatest, first } from 'rxjs';
import {
  EbikeProfile,
  EbikeProfileService,
} from '../../services/api/ebike-profile.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatRipple } from '@angular/material/core';

/**
 * Displays eBikes
 */
@Component({
  selector: 'app-ebikes',
  imports: [
    TranslocoDirective,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatRipple,
    RouterLink,
    MatCardContent,
    MatCardActions,
    MatCardFooter,
  ],
  templateUrl: './ebikes.component.html',
  styleUrl: './ebikes.component.scss',
  standalone: true,
})
export class EbikesComponent implements OnInit {
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

  /** Signal providing eBike profiles */
  ebikeProfiles = signal<EbikeProfile[]>([]);

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
    this.initializeTheme();
    this.initializeEbikes();
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
   * Initializes eBikes
   */
  private initializeEbikes() {
    this.ebikeProfileService.getAllBikes().subscribe((eBikeProfiles) => {
      this.ebikeProfiles.set(eBikeProfiles.bikes);
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
