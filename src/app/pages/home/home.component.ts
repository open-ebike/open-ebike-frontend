import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../services/theme.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { combineLatest, first } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { ActivityRecordsService as Bes3ActivityRecordsService } from '../../services/api/bes3/activity-records.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { EbikeProfileService as Bes3EbikeProfileService } from '../../services/api/bes3/ebike-profile.service';
import { EbikeRegistrationService as Bes3EbikeRegistrationService } from '../../services/api/bes3/ebike-registration.service';
import { Bes3AchievementService } from '../../services/achievement/bes3/bes3-achievement.service';
import { Bes3YearlyAchievementService } from '../../services/yearly-achievement/bes3/bes3-yearly-achievement.service';
import { ActivityService as Bes2ActivityService } from '../../services/api/bes2/activity.service';
import { Bes2AchievementService } from '../../services/achievement/bes2/bes2-achievement.service';
import { Bes2YearlyAchievementService } from '../../services/yearly-achievement/bes2/bes2-yearly-achievement.service';
import { HubService as CobiHubService } from '../../services/api/cobi/hub.service';
import { ActivityService as CobiActivityService } from '../../services/api/cobi/activity.service';
import {
  MapBoxStyle,
  MapComponent,
  Overlay,
} from '../../components/map/map.component';
import { Media, MediaService } from '../../services/media.service';
import { config } from '../../../environments/config';
import {
  RegistrationDialogComponent,
  RegistrationDialogData,
} from '../../components/registration-dialog/registration-dialog.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Displays home component
 */
@Component({
  selector: 'app-home',
  imports: [
    TranslocoDirective,
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
    MatButton,
    RouterLink,
    MatProgressBar,
    MapComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Dialog */
  private dialog = inject(MatDialog);

  /** Theme service */
  public themeService = inject(ThemeService);
  /** Media service */
  public mediaService = inject(MediaService);
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
  /** Achievement service */
  public bes2AchievementService = inject(Bes2AchievementService);
  /** Yearly achievement service */
  public bes2YearlyAchievementService = inject(Bes2YearlyAchievementService);

  /** Hub service */
  public cobiHubService = inject(CobiHubService);
  /** Activity service */
  public cobiActivityService = inject(CobiActivityService);

  //
  // Signals
  //

  // Initialization

  /** Map loaded */
  public mapLoaded = signal(false);

  //
  // Map properties
  //

  /** Height of the map */
  mapHeight = computed(() => {
    return this.mediaService.media() == Media.SMALL
      ? 'calc(100vh - 56px)'
      : 'calc(100vh - 64px)';
  });
  /** Style of the map */
  mapStyle = computed(() => {
    return this.themeService.theme() === Theme.DARK
      ? MapBoxStyle.DARK_V11
      : MapBoxStyle.LIGHT_V11;
  });
  /** Bounding box */
  boundingBox = [
    config.areas['germany'].boundingBox[0] -
      config.mapbox.boundBoxPaddingHorizontal,
    config.areas['germany'].boundingBox[1] -
      config.mapbox.boundBoxPaddingVertical,
    config.areas['germany'].boundingBox[2] +
      config.mapbox.boundBoxPaddingHorizontal,
    config.areas['germany'].boundingBox[3] +
      config.mapbox.boundBoxPaddingVertical,
  ];
  /** Whether interactive mode is enabled or not */
  interactiveEnabled = true;

  /** Overlays */
  overlays: Map<string, Overlay> = new Map<string, Overlay>();

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';

  /** Language */
  lang = getBrowserLang();

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init phase
   */
  async ngOnInit() {
    this.handleQueryParameters();

    await this.authenticationService.processLoginCallback();
  }

  //
  // Initialization
  //

  /**
   * Handles query parameters
   */
  private handleQueryParameters() {
    combineLatest([this.route.queryParams])
      .pipe(first())
      .subscribe(([queryParams]) => {
        const theme = queryParams[this.QUERY_PARAM_THEME];

        this.themeService.switchTheme(theme ? theme : Theme.LIGHT);
      });
  }

  //
  // Actions
  //

  /**
   * Handles click on register with BES3 button
   */
  onRegisterWithBes3Clicked() {
    this.dialog.open(RegistrationDialogComponent, {
      data: {
        selectedEbikeGeneration: 'BES3',
      } as RegistrationDialogData,
    });
  }

  /**
   * Handles click on register with BES2 button
   */
  onRegisterWithBes2Clicked() {
    this.dialog.open(RegistrationDialogComponent, {
      data: {
        selectedEbikeGeneration: 'BES2',
      } as RegistrationDialogData,
    });
  }

  /**
   * Handles click on register with COBI button
   */
  onRegisterWithCobiClicked() {
    this.dialog.open(RegistrationDialogComponent, {
      data: {
        selectedEbikeGeneration: 'COBI',
      } as RegistrationDialogData,
    });
  }
}
