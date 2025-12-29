import { Component, HostListener, inject, input } from '@angular/core';
import { YearlyAchievement } from '../../services/yearly-achievement/yearly-achievement.service';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import { SharePictureComponent } from '../share-picture/share-picture.component';
import { KeyValue, KeyValuePipe } from '@angular/common';
import { YearlyAchievementType } from '../../../environments/yearly-achievements';

/**
 * Displays a yearly achievement carousel
 */
@Component({
  selector: 'app-yearly-achievement-carousel',
  imports: [TranslocoDirective, SharePictureComponent, KeyValuePipe],
  templateUrl: './yearly-achievement-carousel.component.html',
  styleUrl: './yearly-achievement-carousel.component.scss',
  standalone: true,
})
export class YearlyAchievementCarouselComponent {
  //
  // Injections
  //

  /** Transloco service */
  private translocoService = inject(TranslocoService);

  //
  // Signals
  //

  /** Yearly achievement */
  yearlyAchievement = input<
    Map<YearlyAchievementType, YearlyAchievement> | undefined
  >(new Map<YearlyAchievementType, YearlyAchievement>());

  /** Language */
  lang = getBrowserLang();

  /** Key value order */
  public keyValueOrder = (
    a: KeyValue<any, any>,
    b: KeyValue<any, any>,
  ): number => {
    return 0;
  };

  /** Share picture dimension */
  sharePictureDimension = 400;

  //
  // Actions
  //

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const breakPointSmall = 960;
    const padding = 16;

    if (window.innerWidth <= breakPointSmall) {
      this.sharePictureDimension = (window.innerWidth - 2 * padding) * 0.75;
    } else {
      this.sharePictureDimension = 400;
    }
  }

  //
  // Helpers
  //

  /**
   * Generates text based on achievement
   * @param achievement achievement
   */
  getText(achievement: YearlyAchievement) {
    return this.translocoService.translate(
      `pages.yearly-achievements.${achievement.translationSharePicture}`,
      { value: achievement.value },
      this.lang,
    );
  }
}
