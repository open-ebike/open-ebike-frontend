import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';

/**
 * Displays yearly achievements
 */
@Component({
  selector: 'app-yearly-achievements',
  imports: [TranslocoDirective],
  templateUrl: './bes2-yearly-achievements.component.html',
  styleUrl: './bes2-yearly-achievements.component.scss',
  standalone: true,
})
export class Bes2YearlyAchievementsComponent {
  //
  // Injections
  //

  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();
}
