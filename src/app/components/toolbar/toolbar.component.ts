import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../../services/theme.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { getBrowserLang, TranslocoModule } from '@jsverse/transloco';
import { AuthenticationService } from '../../services/authentication.service';
import { Media, MediaService } from '../../services/media.service';
import { environment } from '../../../environments/environment';
import { ActivityRecordsService as Bes3ActivityRecordsService } from '../../services/api/bes3/activity-records.service';
import { EbikeProfileService as Bes3EbikeProfileService } from '../../services/api/bes3/ebike-profile.service';
import { EbikeRegistrationService as Bes3EbikeRegistrationService } from '../../services/api/bes3/ebike-registration.service';
import { Bes3AchievementService } from '../../services/achievement/bes3/bes3-achievement.service';
import { Bes3YearlyAchievementService } from '../../services/yearly-achievement/bes3/bes3-yearly-achievement.service';
import { ActivityService as Bes2ActivityService } from '../../services/api/bes2/activity.service';

/**
 * Displays toolbar
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RouterModule,
    TranslocoModule,
  ],
  standalone: true,
})
export class ToolbarComponent {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Media service */
  public mediaService = inject(MediaService);
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

  /** Activity service */
  public bes2ActivityService = inject(Bes2ActivityService);

  /** Language */
  lang = getBrowserLang();
  /** Media enum */
  mediaEnum = Media;
  /** Theme enum */
  themeEnum = Theme;

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';

  //
  // Actions
  //

  /**
   * On dark mode clicked
   */
  onDarkModeClicked() {
    this.themeService.switchTheme(Theme.DARK);
    this.updateQueryParameters();
  }

  /**
   * On light mode clicked
   */
  onLightModeClicked() {
    this.themeService.switchTheme(Theme.LIGHT);
    this.updateQueryParameters();
  }

  //
  // Helpers
  //

  /**
   * Updates query parameters
   */
  private updateQueryParameters() {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {
          [this.QUERY_PARAM_THEME]: this.themeService.theme(),
        },
      })
      .then();
  }

  protected readonly environment = environment;
}
