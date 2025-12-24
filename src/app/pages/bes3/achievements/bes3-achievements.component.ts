import { Component, inject } from '@angular/core';
import { AchievementService } from '../../../services/other/bes3/achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatCard } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import {
  DatePipe,
  KeyValue,
  KeyValuePipe,
  NgClass,
  TitleCasePipe,
} from '@angular/common';

/**
 * Displays achievements
 */
@Component({
  selector: 'app-bes3-achievements',
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

  /** Key value order */
  public keyValueOrder = (
    a: KeyValue<any, any>,
    b: KeyValue<any, any>,
  ): number => {
    return 0;
  };
}
