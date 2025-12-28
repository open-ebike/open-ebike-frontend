import { Component, inject, input, model } from '@angular/core';
import { KeyValue, KeyValuePipe } from '@angular/common';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import { YearlyAchievement } from '../../services/yearly-achievement/yearly-achievement.service';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';

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
  ],
  templateUrl: './yearly-achievement-grid.component.html',
  styleUrl: './yearly-achievement-grid.component.scss',
  standalone: true,
})
export class YearlyAchievementGridComponent {
  //
  // Injections
  //

  /** Transloco service */
  private translocoService = inject(TranslocoService);

  //
  // Signals
  //

  /** Yearly achievements */
  yearlyAchievements = input<Map<number, YearlyAchievement>>(
    new Map<number, YearlyAchievement>(),
  );
  /** Selected year */
  yearSelected = model<number>();

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
