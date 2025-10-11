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
import {
  EbikeProfile,
  EbikeProfileService,
} from '../../../services/api/bes2/ebike-profile.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Theme, ThemeService } from '../../../services/theme.service';
import { combineLatest, first } from 'rxjs';

/**
 * Displays eBikes
 */
@Component({
  selector: 'app-ebikes',
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
  templateUrl: './bes2-ebikes.component.html',
  styleUrl: './bes2-ebikes.component.scss',
  standalone: true,
})
export class Bes2EbikesComponent implements OnInit {
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
    this.initializeEbikes();
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
}
