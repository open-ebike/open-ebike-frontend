import { Component, inject } from '@angular/core';
import { AchievementService } from '../../../services/other/bes2/achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import {
  DatePipe,
  KeyValue,
  KeyValuePipe,
  NgClass,
  TitleCasePipe,
} from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';

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
  templateUrl: './bes2-achievements.component.html',
  styleUrl: './bes2-achievements.component.scss',
  standalone: true,
})
export class Bes2AchievementsComponent {
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
