import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  YearlyAchievement,
  YearlyAchievementService,
} from '../yearly-achievement.service';
import {
  ActivityDetail,
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

  /** Actual item count */
  itemCount = signal(0);
  /** Total item count */
  totalItemCount = signal(0);
  /** Percentage of loaded items */
  percentage = computed(() => {
    try {
      return (this.itemCount() / this.totalItemCount()) * 100;
    } catch {
      return 0;
    }
  });
  /** Loading state */
  loading = computed<boolean>(() => {
    return (
      this.totalItemCount() != 0 && this.itemCount() != this.totalItemCount()
    );
  });

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  async evaluate() {
    this.itemCount.set(0);

    this.activityRecordsService
      .getAllActivitySummaries(Infinity)
      .subscribe(async (activitySummaries) => {
        // Update total items count
        this.totalItemCount.set(activitySummaries.activitySummaries.length);

        for (let activitySummary of activitySummaries.activitySummaries) {
          const activityDetails = await firstValueFrom(
            this.activityRecordsService.getActivityDetails(activitySummary.id),
          );
          // const activityDetails = activityDetails.activityDetails.find(
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
              activityDetails.activityDetails,
            ),
          );

          // Update actual items count
          this.itemCount.update((value) => value + 1);
        }
      });
  }

  /**
   * Evaluates yearly statistics
   * @param yearlyAchievements yearly achievements
   * @param activitySummary activity summary
   * @param activityDetails activity details
   */
  private evaluateYearlyStatistics(
    yearlyAchievements: Map<
      number,
      Map<YearlyAchievementType, YearlyAchievement>
    >,
    activitySummary: ActivitySummary,
    activityDetails: ActivityDetail[],
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
        achievementTotalDistance.value = this.roundDecimals(
          (achievementTotalDistance.value ?? 0) +
            activitySummary.distance / 1_000,
        );
      }

      const achievementTotalDuration = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.TOTAL_DURATION);
      if (achievementTotalDuration) {
        achievementTotalDuration.value = this.roundDecimals(
          (achievementTotalDuration.value ?? 0) +
            activitySummary.durationWithoutStops / 60 / 60,
        );
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

      const achievementMaxAltitude = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.MAX_ALTITUDE);
      if (achievementMaxAltitude) {
        const highestAltitude = activityDetails
          .map((activityDetail) => {
            return activityDetail.altitude;
          })
          .reduce((prev, current) => {
            return prev > current ? prev : current;
          });

        achievementMaxAltitude.value = Math.max(
          achievementMaxAltitude.value ?? 0,
          highestAltitude,
        );
      }
    }

    return new Map(yearlyAchievements);
  }

  //
  // Helpers
  //

  /**
   * Rounds a value to a given number of decimals
   * @param value value
   * @param decimals decimals
   */
  roundDecimals(value: number, decimals: number = 2) {
    return Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);
  }
}
