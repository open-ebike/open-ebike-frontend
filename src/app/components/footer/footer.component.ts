import { Component, inject } from '@angular/core';
import { getBrowserLang, TranslocoModule } from '@jsverse/transloco';
import { AuthenticationService } from '../../services/authentication.service';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

/**
 * Displays footer
 */
@Component({
  selector: 'app-footer',
  imports: [TranslocoModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
})
export class FooterComponent {
  //
  // Injections
  //

  /** Theme service */
  public themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Current year */
  year = new Date().getFullYear();

  /** Language */
  lang = getBrowserLang();
}
