import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../../services/theme.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { getBrowserLang, TranslocoModule } from '@jsverse/transloco';
import { AuthenticationService } from '../../services/authentication.service';
import { Media, MediaService } from '../../services/media.service';

/**
 * Displays toolbar
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RouterModule,
    TranslocoModule,
  ],
  standalone: true,
})
export class ToolbarComponent {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Media service */
  public mediaService = inject(MediaService);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();
  /** Media enum */
  mediaEnum = Media;
  /** Theme enum */
  themeEnum = Theme;

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';

  //
  // Actions
  //

  /**
   * On dark mode clicked
   */
  onDarkModeClicked() {
    this.themeService.switchTheme(Theme.DARK);
    this.updateQueryParameters();
  }

  /**
   * On light mode clicked
   */
  onLightModeClicked() {
    this.themeService.switchTheme(Theme.LIGHT);
    this.updateQueryParameters();
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
