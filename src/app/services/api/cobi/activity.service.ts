import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface Activities {
  /** An activity of a Rider */
  activities: Activity[];
}

export interface Activity {
  /** Unique activity ID */
  id?: string;
  /** Start time of the activity */
  startTime?: string;
  /** End time of the activity */
  endTime?: string;
  /** The distance of the activity in meters */
  totalDistance?: number;
  /** The bike type (eBike or Bio bike) */
  bikeType?: 'BIOBIKE' | 'ELECTRIC_25' | 'ELECTRIC_45';
  /** The elevation gain in meter */
  elevationGain?: number;
  /** The average speed in km/h */
  avgSpeed?: number;
  /** The maximum speed in km/h */
  maxSpeed?: number;
  /** The total duration during the ride in which the bike was actually moving */
  durationWithoutStops: number | null;
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
   * Lists activities
   */
  getActivities(): Observable<Activities> {
    return this.http.get<Activities>(
      `${environment.eBikeApiUrl}/cobi/v1/activities`,
    );
  }
}
