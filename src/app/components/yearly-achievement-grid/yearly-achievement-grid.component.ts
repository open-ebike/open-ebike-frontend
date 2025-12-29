import { Component, input, model } from '@angular/core';
import { KeyValue, KeyValuePipe } from '@angular/common';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { YearlyAchievement } from '../../services/yearly-achievement/yearly-achievement.service';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { YearlyAchievementType } from '../../../environments/yearly-achievements';
import { MatButton } from '@angular/material/button';

/**
 * Displays yearly achievement grid
 */
@Component({
  selector: 'app-yearly-achievement-grid',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatRipple,
    KeyValuePipe,
    MatCardHeader,
    TranslocoDirective,
    MatButton,
  ],
  templateUrl: './yearly-achievement-grid.component.html',
  styleUrl: './yearly-achievement-grid.component.scss',
  standalone: true,
})
export class YearlyAchievementGridComponent {
  //
  // Signals
  //

  /** Yearly achievements */
  yearlyAchievements = input<
    Map<number, Map<YearlyAchievementType, YearlyAchievement>>
  >(new Map<number, Map<YearlyAchievementType, YearlyAchievement>>());
  /** Selected year */
  yearSelected = model<number>();

  /** Yearly achievement type enum */
  yearlyAchievementType = YearlyAchievementType;

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
