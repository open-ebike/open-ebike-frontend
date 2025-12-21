import { Component, inject } from '@angular/core';
import { AchievementService } from '../../../services/other/bes3/achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';

/**
 * Displays achievements
 */
@Component({
  selector: 'app-achievements',
  imports: [TranslocoDirective],
  templateUrl: './bes3-achievements.component.html',
  styleUrl: './bes3-achievements.component.scss',
  standalone: true,
})
export class Bes3AchievementsComponent {
  /** Achievement service */
  public achievementService = inject(AchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();
}
