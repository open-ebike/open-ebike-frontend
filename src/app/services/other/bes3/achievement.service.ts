import { inject, Injectable } from '@angular/core';
import { ActivityRecordsService } from '../../api/bes3/activity-records.service';

/**
 * Types of achievements
 */
export enum AchievementType {
  ONE_ACTIVITY_COMPLETED = 'ONE_ACTIVITY_COMPLETED',
  TEN_ACTIVITIES_COMPLETED = 'TEN_ACTIVITIES_COMPLETED',
}

/**
 * Represents an achievement
 */
export interface Achievement {
  /** Date */
  date?: string;
  /** Icon */
  icon?: string;
  /** Translation */
  translation?: string;
}

/**
 * Handles achievements
 */
@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  //
  // Injections
  //

  /** Activity records service */
  private activityRecordsService = inject(ActivityRecordsService);

  /** Achievements and their date of achieval */
  achievements = new Map<AchievementType, Achievement>([
    [
      AchievementType.ONE_ACTIVITY_COMPLETED,
      {
        icon: 'assets/achievements/medal.png',
        translation: 'terms.one-activity-completed',
      },
    ],
    [
      AchievementType.TEN_ACTIVITIES_COMPLETED,
      {
        icon: 'assets/achievements/medal.png',
        translation: 'terms.ten-activities-completed',
      },
    ],
  ]);

  /**
   * Constructor
   */
  constructor() {
    this.initialize();
  }

  //
  // Helpers
  //

  /** Total activity count */
  totalActivityCount = 0;

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  private async initialize() {
    this.activityRecordsService
      .getAllActivitySummariesRecursively(100, 'startTime')
      .subscribe((activitySummaries) => {
        activitySummaries.forEach((activitySummary) => {
          this.totalActivityCount += 1;

          if (
            !this.achievements.get(AchievementType.ONE_ACTIVITY_COMPLETED)
              ?.date &&
            this.totalActivityCount >= 1
          ) {
            this.achievements.set(AchievementType.ONE_ACTIVITY_COMPLETED, {
              ...this.achievements.get(AchievementType.ONE_ACTIVITY_COMPLETED),
              date: activitySummary.endTime,
            });
          }

          if (
            !this.achievements.get(AchievementType.TEN_ACTIVITIES_COMPLETED)
              ?.date &&
            this.totalActivityCount >= 10
          ) {
            this.achievements.set(AchievementType.TEN_ACTIVITIES_COMPLETED, {
              ...this.achievements.get(
                AchievementType.TEN_ACTIVITIES_COMPLETED,
              ),
              date: activitySummary.endTime,
            });
          }
        });
      });
  }
}
