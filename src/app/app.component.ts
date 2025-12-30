import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme, ThemeService } from './services/theme.service';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { environment } from '../environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { Meta } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';

/**
 * Displays app component
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  //
  // Injections
  //

  /** Theme service */
  public themeService = inject(ThemeService);
  /** Overlay container */
  private overlayContainer = inject(OverlayContainer);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Meta service */
  private meta = inject(Meta);

  /**
   * Constructor
   */
  constructor() {
    if (environment.mapbox.accessToken) {
      localStorage.setItem('mapboxAccessToken', environment.mapbox.accessToken);
    }

    effect(() => {
      // Theme menus and dialogs
      const overlayContainerClasses =
        this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter(
        (item: string) => item.includes('theme'),
      );
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(this.themeService.theme());

      switch (this.themeService.theme()) {
        case Theme.LIGHT: {
          this.meta.updateTag({ content: '#FFFFFF' }, 'name=theme-color');
          break;
        }
        case Theme.DARK: {
          this.meta.updateTag({ content: '#212121' }, 'name=theme-color');
          break;
        }
      }
    });
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init phase
   */
  async ngOnInit() {
    await this.authenticationService.restoreConfig();
    this.initializeTheme();
  }

  //
  // Initialization
  //

  /**
   * Initializes theme
   */
  private initializeTheme() {
    this.overlayContainer
      .getContainerElement()
      .classList.add(this.themeService.theme());
  }
}
