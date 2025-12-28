import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { YearlyAchievementGridComponent } from '../../../components/yearly-achievement-grid/yearly-achievement-grid.component';
import { Bes3YearlyAchievementService } from '../../../services/yearly-achievement/bes3/bes3-yearly-achievement.service';

/**
 * Displays yearly achievements
 */
@Component({
  selector: 'app-yearly-achievements',
  imports: [TranslocoDirective, YearlyAchievementGridComponent],
  templateUrl: './bes3-yearly-achievements.component.html',
  styleUrl: './bes3-yearly-achievements.component.scss',
  standalone: true,
})
export class Bes3YearlyAchievementsComponent {
  //
  // Injections
  //

  /** Yearly achievement service */
  public yearlyAchievementService = inject(Bes3YearlyAchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();
}
