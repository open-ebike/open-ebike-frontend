import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getBrowserLang, TranslocoModule } from '@jsverse/transloco';

/**
 * Displays footer
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslocoModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
})
export class FooterComponent {
  /** Current year */
  year = new Date().getFullYear();

  /** Language */
  lang = getBrowserLang();
}
