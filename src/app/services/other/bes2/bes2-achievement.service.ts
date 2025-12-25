import { computed, inject, Injectable, signal } from '@angular/core';
import { RegionFinderService } from '../../region-finder.service';
import { firstValueFrom } from 'rxjs';
import { ActivityService } from '../../api/bes2/activity.service';
import {
  Achievement,
  AchievementService,
  AchievementType,
} from '../achievement.service';

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
    this.achievementService.achievementsActivities,
  );
  /** Achievements */
  achievementsDistances = signal(this.achievementService.achievementsDistances);
  /** Achievements */
  achievementsElevationGain = signal(
    this.achievementService.achievementsElevationGain,
  );
  /** Achievements */
  achievementsRegions = signal(this.achievementService.achievementsRegions);

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
    this.initialize();
  }

  //
  // Initialization
  //

  /**
   * Loads activities and evaluates if achievements have been reached
   */
  private async initialize() {
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
        }
      });
  }
}
