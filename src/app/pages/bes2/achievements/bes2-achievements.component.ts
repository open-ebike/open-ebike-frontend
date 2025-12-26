import { Component, inject } from '@angular/core';
import { Bes2AchievementService } from '../../../services/achievement/bes2/bes2-achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { AchievementGridComponent } from '../../../components/achievement-grid/achievement-grid.component';

/**
 * Displays achievements
 */
@Component({
  selector: 'app-bes2-achievements',
  imports: [TranslocoDirective, AchievementGridComponent],
  templateUrl: './bes2-achievements.component.html',
  styleUrl: './bes2-achievements.component.scss',
  standalone: true,
})
export class Bes2AchievementsComponent {
  //
  // Injections
  //

  /** Achievement service */
  public achievementService = inject(Bes2AchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();
}
