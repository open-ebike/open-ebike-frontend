import { inject, Injectable } from '@angular/core';
import {
  ActivityRecordsService,
  ActivitySummary,
} from '../../api/bes3/activity-records.service';

/**
 * Handles achievements
 */
@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  /** Activities */
  private activitySummaries: ActivitySummary[] = [];

  /** Activity records service */
  private activityRecordsService = inject(ActivityRecordsService);

  /**
   * Constructor
   */
  constructor() {
    this.loadActivities();
  }

  //
  // Helpers
  //

  /**
   * Loads activities
   */
  private async loadActivities() {
    this.activityRecordsService
      .getAllActivitySummariesRecursively(100)
      .subscribe((activitySummaries) => {
        this.activitySummaries = activitySummaries;
      });
  }
}
