import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { environment } from '../environments/environment';

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
export class AppComponent {
  //
  // Injections
  //

  /** Theme service */
  public themeService = inject(ThemeService);

  constructor() {
    if (environment.mapbox.accessToken) {
      localStorage.setItem('mapboxAccessToken', environment.mapbox.accessToken);
    }
  }
}
