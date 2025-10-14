import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ActivitySummaries {
  pagination: ActivitySummariesPagination;
  activities: ActivitySummary[];
  links: ActivitySummariesLinks;
}

export interface ActivitySummariesPagination {
  offset: number;
  limit: number;
  /** Total number of items */
  total: number;
}

export interface ActivitySummary extends BaseActivity {
  /** ID of the activity */
  id: number;
  type: 'TRIP' | 'BIKE_RIDE';
  /** Array of bike rides that make up this activity summary */
  bikeRides: BikeRide[];
}

export interface BaseActivity {
  /** Start time of the activity */
  startTime: string;
  /** Shows if the trip has been closed or bike rides can still be added to it */
  isCompleted: boolean;
  /** Total distance (meters) of the activity */
  totalDistance: number;
  /** End time of the activity */
  endTime?: string;
  /** Total moving time (ms) */
  durationWithoutStops?: number;
  /** Title as defined by the rider */
  title?: string;
}

export interface BikeRide extends BaseActivity {
  type: 'BIKE_RIDE';
  /** Calculated calories burned during the bike ride */
  caloriesBurned?: number;
  /** Calculated average speed (km/h) during the bike ride */
  avgSpeed?: number;
  /** Max speed (km/h) registered during bike ride */
  maxSpeed?: number;
}

export interface ActivitySummariesLinks {
  self: string;
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

/**
 * Handles activities
 */
@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Lists all activity summaries
   * @param limit limit
   * @param offset offset
   */
  getAllActivitySummaries(
    limit: number,
    offset: number,
  ): Observable<ActivitySummaries> {
    return this.http.get<ActivitySummaries>(
      `${environment.eBikeApiUrl}/activity/ebike-system-2/v1/activities?limit=${limit}&offset=${offset}`,
    );
  }
}
