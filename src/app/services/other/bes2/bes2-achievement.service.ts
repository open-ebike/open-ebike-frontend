import { inject, Injectable } from '@angular/core';
import { RegionFinderService } from '../../region-finder.service';
import { firstValueFrom } from 'rxjs';
import { ActivityService } from '../../api/bes2/activity.service';
import { AchievementService } from '../achievement.service';

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

  /** Achievements and their date of achieval */
  achievementsActivities = new Map(
    this.achievementService.achievementsActivities,
  );
  /** Achievements and their date of achieval */
  achievementsDistances = new Map(
    this.achievementService.achievementsDistances,
  );
  /** Achievements and their date of achieval */
  achievementsElevationGain = new Map(
    this.achievementService.achievementsElevationGain,
  );
  /** Achievements and their date of achieval */
  achievementsRegions = new Map(this.achievementService.achievementsRegions);

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

          this.achievementsActivities =
            this.achievementService.evaluateActivities(
              this.achievementsActivities,
              totalActivityCount,
              activitySummary.startTime,
            );
          this.achievementsDistances =
            this.achievementService.evaluateDistances(
              this.achievementsDistances,
              totalDistance,
              activitySummary.startTime,
            );
          this.achievementsElevationGain =
            this.achievementService.evaluateElevationGain(
              this.achievementsElevationGain,
              totalElevationGain,
              activitySummary.startTime,
            );
          this.achievementsRegions = this.achievementService.evaluateRegions(
            this.achievementsRegions,
            federalState ?? '',
            activitySummary.startTime,
          );
        }
      });
  }
}
