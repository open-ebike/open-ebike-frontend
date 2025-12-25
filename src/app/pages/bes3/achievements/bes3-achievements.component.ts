import { Component, inject } from '@angular/core';
import { Bes3AchievementService } from '../../../services/other/bes3/bes3-achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { AchievementGridComponent } from '../../../components/achievement-grid/achievement-grid.component';

/**
 * Displays achievements
 */
@Component({
  selector: 'app-bes3-achievements',
  imports: [TranslocoDirective, AchievementGridComponent],
  templateUrl: './bes3-achievements.component.html',
  styleUrl: './bes3-achievements.component.scss',
  standalone: true,
})
export class Bes3AchievementsComponent {
  //
  // Injections
  //

  /** Achievement service */
  public achievementService = inject(Bes3AchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();
}
