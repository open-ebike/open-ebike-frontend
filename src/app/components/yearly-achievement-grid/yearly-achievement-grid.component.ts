import { Component, effect, input, model } from '@angular/core';
import { KeyValue, KeyValuePipe } from '@angular/common';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { YearlyAchievement } from '../../services/yearly-achievement/yearly-achievement.service';
import { MatRipple } from '@angular/material/core';
import { YearlyAchievementType } from '../../../environments/yearly-achievements';
import { MatButton } from '@angular/material/button';

/**
 * Displays yearly achievement grid
 */
@Component({
  selector: 'app-yearly-achievement-grid',
  imports: [MatRipple, KeyValuePipe, TranslocoDirective, MatButton],
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

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      const yearsWithActivities = Array.from(
        this.yearlyAchievements().entries(),
      ).filter((yearlyAchievement) => {
        return (
          yearlyAchievement[1].get(YearlyAchievementType.TOTAL_ACTIVITY_COUNT)
            ?.value ?? 0 >= 1
        );
      });

      if (yearsWithActivities.length == 0) {
        this.yearSelected.set(undefined);
      }
      if (yearsWithActivities.length == 1) {
        this.yearSelected.set(yearsWithActivities[0][0]);
      }
    });
  }
}
