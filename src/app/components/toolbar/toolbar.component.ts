import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../../services/theme.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Media, MediaService } from '../../services/media.service';
import { getBrowserLang, TranslocoModule } from '@jsverse/transloco';

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

  /** Router */
  private router = inject(Router);
  /** Media service */
  public mediaService = inject(MediaService);
  /** Theme service */
  public themeService = inject(ThemeService);

  /** Language */
  lang = getBrowserLang();

  /** Media enum */
  mediaEnum = Media;
  /** Theme enum */
  themeEnum = Theme;

  //
  // Actions
  //

  /**
   * On dark mode clicked
   */
  onDarkModeClicked() {
    this.themeService.switchTheme(Theme.DARK);
  }

  /**
   * On light mode clicked
   */
  onLightModeClicked() {
    this.themeService.switchTheme(Theme.LIGHT);
  }

  //
  // Helpers
  //

  /**
   * Checks if a given route is active
   * @param routePath route path
   */
  isRouteActive(routePath: string): boolean {
    return this.router.url.replace(/\?.*/, '') === routePath;
  }
}
