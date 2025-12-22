import { Component, inject } from '@angular/core';
import {
  AchievementService,
  AchievementType,
} from '../../../services/other/bes3/achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatCard } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import {
  DatePipe,
  KeyValuePipe,
  NgClass,
  TitleCasePipe,
} from '@angular/common';

/**
 * Displays achievements
 */
@Component({
  selector: 'app-achievements',
  imports: [
    TranslocoDirective,
    KeyValuePipe,
    MatCard,
    NgClass,
    MatRipple,
    DatePipe,
    TitleCasePipe,
  ],
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

  /** Achievement type enum */
  achievementTypeEnum = AchievementType;
}
