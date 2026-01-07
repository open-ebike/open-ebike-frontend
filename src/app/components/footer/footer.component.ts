import { Component, inject } from '@angular/core';
import { getBrowserLang, TranslocoModule } from '@jsverse/transloco';
import { AuthenticationService } from '../../services/authentication.service';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { Bes2YearlyAchievementService } from '../../services/yearly-achievement/bes2/bes2-yearly-achievement.service';
import { ActivityRecordsService as Bes3ActivityRecordsService } from '../../services/api/bes3/activity-records.service';
import { EbikeProfileService as Bes3EbikeProfileService } from '../../services/api/bes3/ebike-profile.service';
import { EbikeRegistrationService as Bes3EbikeRegistrationService } from '../../services/api/bes3/ebike-registration.service';
import { Bes3AchievementService } from '../../services/achievement/bes3/bes3-achievement.service';
import { Bes3YearlyAchievementService } from '../../services/yearly-achievement/bes3/bes3-yearly-achievement.service';
import { ActivityService as Bes2ActivityService } from '../../services/api/bes2/activity.service';
import { Bes2AchievementService } from '../../services/achievement/bes2/bes2-achievement.service';
import { HubService as CobiHubService } from '../../services/api/cobi/hub.service';
import { ActivityService as CobiActivityService } from '../../services/api/cobi/activity.service';
import { EbikeProfileService as Bes2EbikeProfileService } from '../../services/api/bes2/ebike-profile.service';

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

  /** eBike profile service */
  public bes3EbikeProfileService = inject(Bes3EbikeProfileService);
  /** Activity records service */
  public bes3ActivityRecordsService = inject(Bes3ActivityRecordsService);
  // eBike Registration service */
  public bes3RegistrationService = inject(Bes3EbikeRegistrationService);
  /** Achievement service */
  public bes3AchievementService = inject(Bes3AchievementService);
  /** Yearly achievement service */
  public bes3YearlyAchievementService = inject(Bes3YearlyAchievementService);

  /** eBike profile service */
  public bes2EbikeProfileService = inject(Bes2EbikeProfileService);
  /** Activity service */
  public bes2ActivityService = inject(Bes2ActivityService);
  /** Achievement service */
  public bes2AchievementService = inject(Bes2AchievementService);
  /** Yearly achievement service */
  public bes2YearlyAchievementService = inject(Bes2YearlyAchievementService);

  /** Hub service */
  public cobiHubService = inject(CobiHubService);
  /** Activity service */
  public cobiActivityService = inject(CobiActivityService);

  /** Current year */
  year = new Date().getFullYear();

  /** Language */
  lang = getBrowserLang();
}
