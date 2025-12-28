import { inject, Injectable, signal } from '@angular/core';
import {
  YearlyAchievement,
  YearlyAchievementService,
} from '../yearly-achievement.service';
import {
  ActivityService,
  ActivitySummary,
} from '../../api/bes2/activity.service';
import { firstValueFrom, map } from 'rxjs';
import { RegionFinderService } from '../../region-finder.service';

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
  yearlyAchievements = signal(new Map<number, YearlyAchievement>());

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
    yearlyAchievements: Map<number, YearlyAchievement>,
    activitySummary: ActivitySummary,
  ) {
    // const date = new Date(activitySummary.startTime);
    // const year = date.getFullYear();

    return yearlyAchievements;
  }
}
