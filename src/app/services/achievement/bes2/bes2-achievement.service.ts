import { computed, inject, Injectable, signal } from '@angular/core';
import { RegionFinderService } from '../../region-finder.service';
import { firstValueFrom } from 'rxjs';
import { ActivityService } from '../../api/bes2/activity.service';
import { Achievement, AchievementService } from '../achievement.service';
import {
  achievements,
  AchievementType,
} from '../../../../environments/achievements';

/**
 * Handles achievements
 */
@Injectable({
  providedIn: 'root',
})
export class Bes2AchievementService {
  //
  // Injections
  //

  /** Achievement service*/
  private achievementService = inject(AchievementService);
  /** Activity service */
  private activityService = inject(ActivityService);
  /** Region finder service */
  private regionFinderService = inject(RegionFinderService);

  //
  // Achievements
  //

  /** Achievements */
  achievementsActivities = signal(
    this.achievementService.convertToMap(achievements.activities),
  );
  /** Achievements */
  achievementsDistances = signal(
    this.achievementService.convertToMap(achievements.distances),
  );
  /** Achievements */
  achievementsDurations = signal(
    this.achievementService.convertToMap(achievements.durations),
  );
  /** Achievements */
  achievementsElevationGain = signal(
    this.achievementService.convertToMap(achievements.elevationGain),
  );
  /** Achievements */
  achievementsTimes = signal(
    this.achievementService.convertToMap(achievements.times),
  );
  /** Achievements */
  achievementsTimePeriods = signal(new Map<number, Map<string, Achievement>>());
  /** Achievements */
  achievementsRegions = signal(
    this.achievementService.convertToMap(achievements.regions),
  );

  /** Achievements */
  achievementsBasic = computed(() => {
    return new Map<AchievementType, Achievement>([
      ...this.achievementsActivities(),
      ...this.achievementsDistances(),
      ...this.achievementsDurations(),
      ...this.achievementsElevationGain(),
      ...this.achievementsTimes(),
    ]);
  });

  //
  // Initialization
  //

  async initialize(firstActivityDate: Date) {
    const achievementsTimePeriods =
      this.achievementService.initializeAchievementsTimePeriods(
        firstActivityDate,
      );
    this.achievementsTimePeriods.set(achievementsTimePeriods);
  }

  /** Actual item count */
  itemCount = signal(0);
  /** Total item count */
  totalItemCount = signal(-1);
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
    return this.itemCount() != this.totalItemCount();
  });

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  async evaluate() {
    this.itemCount.set(0);

    /** Total activity count */
    let totalActivityCount = 0;
    /** Total distance */
    let totalDistance = 0;
    /** Total elevation gain */
    let totalElevationGain = 0;

    this.activityService
      .getAllActivitySummaries(Infinity)
      .subscribe(async (activitySummaries) => {
        // Update total items count
        this.totalItemCount.set(activitySummaries.activities.length);

        for (let activitySummary of activitySummaries.activities) {
          const activityDetails = await firstValueFrom(
            this.activityService.getActivityDetails(activitySummary.id),
          );
          const coordinate = activityDetails.coordinates
            ?.flat()
            .find((point) => {
              return point?.latitude != 0.0 && point?.longitude != 0.0;
            });
          const lat = coordinate?.latitude;
          const lon = coordinate?.longitude;
          const federalState =
            lat != null && lon != null
              ? this.regionFinderService.getFederalState(lat, lon)
              : null;

          totalActivityCount += 1;
          totalDistance += activitySummary.totalDistance;
          totalElevationGain += activityDetails.elevationGain ?? 0;

          this.achievementsActivities.set(
            this.achievementService.evaluateActivities(
              this.achievementsActivities(),
              totalActivityCount,
              activitySummary.startTime,
            ),
          );

          this.achievementsDistances.set(
            this.achievementService.evaluateDistances(
              this.achievementsDistances(),
              totalDistance,
              activitySummary.startTime,
            ),
          );

          this.achievementsDurations.set(
            this.achievementService.evaluateDurations(
              this.achievementsDurations(),
              activitySummary.durationWithoutStops ?? 0,
              activitySummary.startTime,
            ),
          );

          this.achievementsElevationGain.set(
            this.achievementService.evaluateElevationGain(
              this.achievementsElevationGain(),
              totalElevationGain,
              activitySummary.startTime,
            ),
          );

          this.achievementsTimes.set(
            this.achievementService.evaluateTimes(
              this.achievementsTimes(),
              activitySummary.startTime,
              activitySummary.endTime,
            ),
          );

          this.achievementsTimePeriods.set(
            this.achievementService.evaluateTimePeriods(
              this.achievementsTimePeriods(),
              activitySummary.startTime,
            ),
          );

          this.achievementsRegions.set(
            this.achievementService.evaluateRegions(
              this.achievementsRegions(),
              federalState ?? '',
              activitySummary.startTime,
            ),
          );
        }

        // Update actual items count
        this.itemCount.update((value) => value + 1);
      });
  }
}
