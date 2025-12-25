import { Component, inject, LOCALE_ID } from '@angular/core';
import { Bes2AchievementService } from '../../../services/other/bes2/bes2-achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import {
  DatePipe,
  KeyValue,
  KeyValuePipe,
  NgClass,
  TitleCasePipe,
} from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { SharingBottomSheetComponent } from '../../../components/sharing-bottom-sheet/sharing-bottom-sheet.component';
import { environment } from '../../../../environments/environment';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Achievement } from '../../../services/other/achievement.service';

/**
 * Displays achievements
 */
@Component({
  selector: 'app-bes2-achievements',
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
  public achievementService = inject(Bes2AchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Bottom sheet */
  private bottomSheet = inject(MatBottomSheet);
  /** Transloco service */
  private translocoService = inject(TranslocoService);

  /** Language */
  lang = getBrowserLang();
  /** Locale */
  locale = inject(LOCALE_ID);

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
   *
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
          `pages.achievements.${achievement.translation!!}`,
        ),
        description: this.translocoService.translate(
          `pages.achievements.terms.on`,
          {
            date: new DatePipe(this.locale).transform(
              achievement.date,
              'mediumDate',
            ),
          },
        ),
        imageUrl: `${environment.hrefBase}${achievement.icon}`,
      },
    });
  }
}
