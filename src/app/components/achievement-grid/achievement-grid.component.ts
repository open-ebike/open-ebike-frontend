import { Component, inject, input } from '@angular/core';
import {
  DatePipe,
  KeyValue,
  KeyValuePipe,
  NgClass,
  TitleCasePipe,
} from '@angular/common';
import { environment } from '../../../environments/environment';
import { Achievement } from '../../services/achievement/achievement.service';
import { SharingBottomSheetComponent } from '../sharing-bottom-sheet/sharing-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import { MatCard } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { AchievementType } from '../../../environments/achievements';

/**
 * Displays achievement grid component
 */
@Component({
  selector: 'app-achievement-grid',
  imports: [
    KeyValuePipe,
    MatCard,
    MatRipple,
    NgClass,
    DatePipe,
    TranslocoDirective,
    TitleCasePipe,
  ],
  templateUrl: './achievement-grid.component.html',
  styleUrl: './achievement-grid.component.scss',
  standalone: true,
})
export class AchievementGridComponent {
  //
  // Injections
  //

  /** Bottom sheet */
  private bottomSheet = inject(MatBottomSheet);
  /** Transloco service */
  private translocoService = inject(TranslocoService);

  //
  // Signals
  //

  /** Achievements */
  achievements = input<Map<string, Achievement>>(
    new Map<AchievementType, Achievement>(),
  );

  /** Language */
  lang = getBrowserLang();

  /** Key value order */
  public keyValueOrder = (
    a: KeyValue<any, any>,
    b: KeyValue<any, any>,
  ): number => {
    return 0;
  };

  //
  // Actions
  //

  /**
   * Handles click on an achievement
   * @param achievement achievement
   */
  onAchievementClicked(achievement: Achievement) {
    // Check if achievement has not been achieved yet
    if (!achievement.achieved) {
      return;
    }

    this.bottomSheet.open(SharingBottomSheetComponent, {
      data: {
        title: this.translocoService.translate(
          `pages.achievements.${achievement.translationSharePicture!!}`,
          achievement.translationContext,
          this.lang,
        ),
        imageUrl: `${environment.hrefBase}${achievement.icon}`,
      },
    });
  }
}
