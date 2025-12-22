import { inject, Injectable } from '@angular/core';
import { ActivityRecordsService } from '../../api/bes3/activity-records.service';

/**
 * Types of achievements
 */
export enum AchievementType {
  ACTIVITIES_1 = 'ACTIVITIES_1',
  ACTIVITIES_10 = 'ACTIVITIES_10',
  DISTANCE_10KM = 'DISTANCE_10KM',
  DISTANCE_100KM = 'DISTANCE_100KM',
  DISTANCE_1000KM = 'DISTANCE_1000KM',
  ELEVATION_GAIN_4806M = 'ELEVATION_GAIN_4806M',
  ELEVATION_GAIN_8848_M = 'ELEVATION_GAIN_8848_M',
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
      AchievementType.ACTIVITIES_1,
      {
        icon: 'assets/achievements/medal.png',
        translation: 'terms.activities-1',
      },
    ],
    [
      AchievementType.ACTIVITIES_10,
      {
        icon: 'assets/achievements/medal.png',
        translation: 'terms.activities-10',
      },
    ],
    [
      AchievementType.DISTANCE_10KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance-10km',
      },
    ],
    [
      AchievementType.DISTANCE_100KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance-100km',
      },
    ],
    [
      AchievementType.DISTANCE_1000KM,
      {
        icon: 'assets/achievements/medal-2.png',
        translation: 'terms.distance-1000km',
      },
    ],
    [
      AchievementType.ELEVATION_GAIN_4806M,
      {
        icon: 'assets/achievements/mountains.png',
        translation: 'terms.elevation-gain-4806m',
      },
    ],
    [
      AchievementType.ELEVATION_GAIN_8848_M,
      {
        icon: 'assets/achievements/mountains.png',
        translation: 'terms.elevation-gain-8848m',
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
  /** Total distance */
  totalDistance = 0;
  /** Total elevation gain */
  totalElevationGain = 0;

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  private async initialize() {
    this.activityRecordsService
      .getAllActivitySummariesRecursively(100, 'startTime')
      .subscribe((activitySummaries) => {
        activitySummaries.forEach((activitySummary) => {
          this.totalActivityCount += 1;
          this.totalDistance += activitySummary.distance;
          this.totalElevationGain += activitySummary.elevation.gain;

          if (
            !this.achievements.get(AchievementType.ACTIVITIES_1)?.date &&
            this.totalActivityCount >= 1
          ) {
            this.achievements.set(AchievementType.ACTIVITIES_1, {
              ...this.achievements.get(AchievementType.ACTIVITIES_1),
              date: activitySummary.endTime,
            });
          }

          if (
            !this.achievements.get(AchievementType.ACTIVITIES_10)?.date &&
            this.totalActivityCount >= 10
          ) {
            this.achievements.set(AchievementType.ACTIVITIES_10, {
              ...this.achievements.get(AchievementType.ACTIVITIES_10),
              date: activitySummary.endTime,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_10KM)?.date &&
            this.totalDistance >= 10_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_10KM, {
              ...this.achievements.get(AchievementType.DISTANCE_10KM),
              date: activitySummary.endTime,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_100KM)?.date &&
            this.totalDistance >= 100_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_100KM, {
              ...this.achievements.get(AchievementType.DISTANCE_100KM),
              date: activitySummary.endTime,
            });
          }

          if (
            !this.achievements.get(AchievementType.DISTANCE_1000KM)?.date &&
            this.totalDistance >= 1_000_000
          ) {
            this.achievements.set(AchievementType.DISTANCE_1000KM, {
              ...this.achievements.get(AchievementType.DISTANCE_1000KM),
              date: activitySummary.endTime,
            });
          }

          if (
            !this.achievements.get(AchievementType.ELEVATION_GAIN_4806M)
              ?.date &&
            this.totalElevationGain >= 4806
          ) {
            this.achievements.set(AchievementType.ELEVATION_GAIN_4806M, {
              ...this.achievements.get(AchievementType.ELEVATION_GAIN_4806M),
              date: activitySummary.endTime,
            });
          }

          if (
            !this.achievements.get(AchievementType.ELEVATION_GAIN_8848_M)
              ?.date &&
            this.totalElevationGain >= 8848
          ) {
            this.achievements.set(AchievementType.ELEVATION_GAIN_8848_M, {
              ...this.achievements.get(AchievementType.ELEVATION_GAIN_8848_M),
              date: activitySummary.endTime,
            });
          }
        });
      });
  }
}
