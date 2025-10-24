import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { combineLatest, first } from 'rxjs';
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
import { Hub, HubService } from '../../../services/api/cobi/hub.service';
import { DatePipe } from '@angular/common';

/**
 * Displays hubs
 */
@Component({
  selector: 'app-hubs',
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
    DatePipe,
  ],
  templateUrl: './cobi-hubs.component.html',
  styleUrl: './cobi-hubs.component.scss',
  standalone: true,
})
export class CobiHubsComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Hub service */
  private hubService = inject(HubService);

  //
  // Signals
  //

  /** Signal providing hubs */
  hubs = signal<Hub[]>([]);

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
    this.initializeHubs();
    this.handleQueryParameters();
  }

  /**
   * Initializes hubs
   */
  private initializeHubs() {
    this.hubService.getHubs().subscribe((hubs) => {
      this.hubs.set(hubs.hubs);
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
