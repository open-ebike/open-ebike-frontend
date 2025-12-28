import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { YearlyAchievementGridComponent } from '../../../components/yearly-achievement-grid/yearly-achievement-grid.component';
import { Bes3YearlyAchievementService } from '../../../services/yearly-achievement/bes3/bes3-yearly-achievement.service';
import { Bes2YearlyAchievementService } from '../../../services/yearly-achievement/bes2/bes2-yearly-achievement.service';

/**
 * Displays yearly achievements
 */
@Component({
  selector: 'app-yearly-achievements',
  imports: [TranslocoDirective, YearlyAchievementGridComponent],
  templateUrl: './bes2-yearly-achievements.component.html',
  styleUrl: './bes2-yearly-achievements.component.scss',
  standalone: true,
})
export class Bes2YearlyAchievementsComponent {
  //
  // Injections
  //

  /** Yearly achievement service */
  public yearlyAchievementService = inject(Bes2YearlyAchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();
}
