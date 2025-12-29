import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import {
  YearlyAchievement,
  YearlyAchievementService,
} from '../yearly-achievement.service';
import {
  ActivityRecordsService,
  ActivitySummary,
} from '../../api/bes3/activity-records.service';
import { RegionFinderService } from '../../region-finder.service';
import { YearlyAchievementType } from '../../../../environments/yearly-achievements';

/**
 * Handles yearly achievements
 */
@Injectable({
  providedIn: 'root',
})
export class Bes3YearlyAchievementService {
  //
  // Injections
  //

  /** Yearly achievement service */
  private yearlyAchievementService = inject(YearlyAchievementService);
  /** Activity records service */
  private activityRecordsService = inject(ActivityRecordsService);
  /** Region finder service */
  private regionFinderService = inject(RegionFinderService);

  //
  // Achievements
  //

  /** Yearly achievements */
  yearlyAchievements = signal(
    new Map<number, Map<YearlyAchievementType, YearlyAchievement>>(),
  );

  /**
   * Constructor
   */
  constructor() {
    this.activityRecordsService
      .getAllActivitySummaries(1, 0, 'startTime')
      .pipe(
        map((activitySummaries) => {
          return activitySummaries.activitySummaries.length > 0
            ? new Date(activitySummaries.activitySummaries[0].startTime)
            : new Date();
        }),
      )
      .subscribe((firstActivityDate) => {
        this.initialize(firstActivityDate);
        this.evaluate();
      });
  }

  //
  // Initialization
  //

  async initialize(firstActivityDate: Date) {
    // Initialize achievements
    this.yearlyAchievements.set(
      this.yearlyAchievementService.initializeYearlyAchievements(
        firstActivityDate,
      ),
    );
  }

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  private async evaluate() {
    this.activityRecordsService
      .getAllActivitySummariesRecursively(100, 'startTime')
      .subscribe(async (activitySummaries) => {
        for (let activitySummary of activitySummaries) {
          // const activityDetails = await firstValueFrom(
          //   this.activityRecordsService.getActivityDetails(activitySummary.id),
          // );
          // const firstActivityDetail = activityDetails.activityDetails.find(
          //   (detail) => {
          //     return detail.latitude != 0.0 && detail.longitude != 0.0;
          //   },
          // );
          // const lat = firstActivityDetail?.latitude;
          // const lon = firstActivityDetail?.longitude;
          // const federalState =
          //   lat != null && lon != null
          //     ? this.regionFinderService.getFederalState(lat, lon)
          //     : null;

          this.yearlyAchievements.set(
            this.evaluateYearlyStatistics(
              this.yearlyAchievements(),
              activitySummary,
            ),
          );
        }
      });
  }

  /**
   * Evaluates yearly statistics
   * @param yearlyAchievements yearly achievements
   * @param activitySummary activity summary
   */
  evaluateYearlyStatistics(
    yearlyAchievements: Map<
      number,
      Map<YearlyAchievementType, YearlyAchievement>
    >,
    activitySummary: ActivitySummary,
  ) {
    const date = new Date(activitySummary.startTime);
    const year = date.getFullYear();

    if (yearlyAchievements.has(year)) {
      const achievementActivityCount = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.TOTAL_ACTIVITY_COUNT);
      if (achievementActivityCount) {
        achievementActivityCount.value =
          (achievementActivityCount.value ?? 0) + 1;
      }

      const achievementTotalDistance = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.TOTAL_DISTANCE);
      if (achievementTotalDistance) {
        achievementTotalDistance.value =
          (achievementTotalDistance.value ?? 0) +
          Math.round((activitySummary.distance / 1_000) * 100) / 100;
      }

      const achievementTotalElevationGain = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.TOTAL_ELEVATION_GAIN);
      if (achievementTotalElevationGain) {
        achievementTotalElevationGain.value =
          (achievementTotalElevationGain.value ?? 0) +
          activitySummary.elevation.gain;
      }

      const achievementTotalCaloriesBurned = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.TOTAL_CALORIES_BURNED);
      if (achievementTotalCaloriesBurned) {
        achievementTotalCaloriesBurned.value =
          (achievementTotalCaloriesBurned.value ?? 0) +
          activitySummary.caloriesBurned;
      }
    }

    return new Map(yearlyAchievements);
  }
}
