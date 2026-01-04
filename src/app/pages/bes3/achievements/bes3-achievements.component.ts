import { Component, inject } from '@angular/core';
import { Bes3AchievementService } from '../../../services/achievement/bes3/bes3-achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { AchievementGridComponent } from '../../../components/achievement-grid/achievement-grid.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';

/**
 * Displays achievements
 */
@Component({
  selector: 'app-bes3-achievements',
  imports: [
    TranslocoDirective,
    AchievementGridComponent,
    MatIcon,
    MatIconButton,
    MatProgressBar,
  ],
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

  protected readonly Array = Array;

  //
  // Actions
  //

  /**
   * Handles click on refresh button
   */
  onRefreshClicked() {
    this.achievementService.evaluate();
  }
}
