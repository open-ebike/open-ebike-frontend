import { computed, inject, Injectable, signal } from '@angular/core';
import { RegionFinderService } from '../../region-finder.service';
import { firstValueFrom, map } from 'rxjs';
import { ActivityService } from '../../api/bes2/activity.service';
import {
  Achievement,
  AchievementService,
  AchievementType,
} from '../achievement.service';
import { achievements } from '../../../../environments/achievements';

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
  achievementsElevationGain = signal(
    this.achievementService.convertToMap(achievements.elevationGain),
  );
  /** Achievements */
  achievementsRegions = signal(
    this.achievementService.convertToMap(achievements.regions),
  );
  /** Achievements */
  achievementsTimePeriods = signal(new Map<number, Map<string, Achievement>>());

  /** Achievements */
  achievementsBasic = computed(() => {
    return new Map<AchievementType, Achievement>([
      ...this.achievementsActivities(),
      ...this.achievementsDistances(),
      ...this.achievementsElevationGain(),
    ]);
  });

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
    const achievementsTimePeriods =
      this.achievementService.initializeAchievementsTimePeriods(
        firstActivityDate,
      );
    this.achievementsTimePeriods.set(achievementsTimePeriods);
  }

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  private async evaluate() {
    /** Total activity count */
    let totalActivityCount = 0;
    /** Total distance */
    let totalDistance = 0;
    /** Total elevation gain */
    let totalElevationGain = 0;

    this.activityService
      .getAllActivitySummariesRecursively(100)
      .subscribe(async (activitySummaries) => {
        for (let activitySummary of activitySummaries) {
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

          this.achievementsElevationGain.set(
            this.achievementService.evaluateElevationGain(
              this.achievementsElevationGain(),
              totalElevationGain,
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

          this.achievementsTimePeriods.set(
            this.achievementService.evaluateTimePeriods(
              this.achievementsTimePeriods(),
              activitySummary.startTime,
            ),
          );
        }
      });
  }
}
