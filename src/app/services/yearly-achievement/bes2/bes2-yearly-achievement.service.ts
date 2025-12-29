import { inject, Injectable, signal } from '@angular/core';
import {
  YearlyAchievement,
  YearlyAchievementService,
} from '../yearly-achievement.service';
import {
  ActivityDetail,
  ActivityService,
  ActivitySummary,
} from '../../api/bes2/activity.service';
import { firstValueFrom, map } from 'rxjs';
import { RegionFinderService } from '../../region-finder.service';
import { YearlyAchievementType } from '../../../../environments/yearly-achievements';
import { ActivityDetails } from '../../api/bes3/activity-records.service';

/**
 * Handles yearly achievements
 */
@Injectable({
  providedIn: 'root',
})
export class Bes2YearlyAchievementService {
  //
  // Injections
  //

  /** Yearly achievement service */
  private yearlyAchievementService = inject(YearlyAchievementService);
  /** Activity service */
  private activityService = inject(ActivityService);
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
    this.activityService
      .getAllActivitySummaries(1, 0)
      .pipe(
        map((activities) => {
          return activities.activities.length > 0
            ? new Date(activities.activities[0].startTime)
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
    this.activityService
      .getAllActivitySummariesRecursively(100)
      .subscribe(async (activitySummaries) => {
        for (let activitySummary of activitySummaries) {
          const activityDetails = await firstValueFrom(
            this.activityService.getActivityDetails(activitySummary.id),
          );
          // const coordinate = activityDetails.coordinates
          //   ?.flat()
          //   .find((point) => {
          //     return point?.latitude != 0.0 && point?.longitude != 0.0;
          //   });
          // const lat = coordinate?.latitude;
          // const lon = coordinate?.longitude;
          // const federalState =
          //   lat != null && lon != null
          //     ? this.regionFinderService.getFederalState(lat, lon)
          //     : null;

          this.yearlyAchievements.set(
            this.evaluateYearlyStatistics(
              this.yearlyAchievements(),
              activitySummary,
              activityDetails,
            ),
          );
        }
      });
  }

  /**
   * Evaluates yearly statistics
   * @param yearlyAchievements yearly achievements
   * @param activitySummary activity summary
   * @param activityDetails activity details
   */
  evaluateYearlyStatistics(
    yearlyAchievements: Map<
      number,
      Map<YearlyAchievementType, YearlyAchievement>
    >,
    activitySummary: ActivitySummary,
    activityDetails: ActivityDetail,
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
          Math.round((activitySummary.totalDistance / 1_000) * 100) / 100;
      }

      const achievementTotalElevationGain = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.TOTAL_ELEVATION_GAIN);
      if (achievementTotalElevationGain) {
        achievementTotalElevationGain.value =
          (achievementTotalElevationGain.value ?? 0) +
          (activityDetails.elevationGain ?? 0);
      }

      const achievementTotalCaloriesBurned = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.TOTAL_CALORIES_BURNED);
      if (achievementTotalCaloriesBurned) {
        achievementTotalCaloriesBurned.value =
          (achievementTotalCaloriesBurned.value ?? 0) +
          (activityDetails.caloriesBurned ?? 0);
      }

      const achievementMaxAltitude = yearlyAchievements
        .get(year)
        ?.get(YearlyAchievementType.MAX_ALTITUDE);
      if (achievementMaxAltitude) {
        const highestAltitude =
          activityDetails.altitudes
            ?.flat()
            .flat()
            .reduce((prev, current) => {
              return (prev ?? 0) > (current ?? 0) ? prev : current;
            }) ?? 0;

        achievementMaxAltitude.value = Math.max(
          achievementMaxAltitude.value ?? 0,
          highestAltitude,
        );
      }
    }

    return new Map(yearlyAchievements);
  }
}
