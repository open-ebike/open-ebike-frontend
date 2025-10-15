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

export interface ActivityDetail extends BaseActivity {
  /** ID of the activity */
  id?: number;
  type: 'TRIP';
  /** Total active time between the moment when activity was started and the moment was finished (ms) */
  durationWithStops?: number;
  /** Calories burned during the ride */
  caloriesBurned?: number;
  /** Total rider effort (%) during the bike ride */
  totalRiderConsumption?: number;
  /** Engine total contribution (%) during the bike ride */
  totalBatteryConsumption?: number;
  /** Shows all assistance levels (%) that were used over 3% */
  significantAssistanceLevels?: AssistanceLevel[];
  /** Sum of all assistance levels (%) that were used under 3% */
  insignificantAssistanceLevelsSum?: number;
  /** Average speed (km/h) measured during the activity */
  avgSpeed?: number;
  /** Average heart rate (bpm) measured during the activity */
  avgHeartRate?: number;
  /** Average cadence (rpm) measured during the activity */
  avgCadence?: number;
  /** Average altitude (m) */
  avgAltitude?: number;
  /** Max speed (km/h) registered during activity */
  maxSpeed?: number;
  /** Max heart rate (bpm) measured during the activity */
  maxHeartRate?: number;
  /** Average cadence (rpm) measured during the activity */
  maxCadence?: number;
  /** Maximum altitude (m) */
  maxAltitude?: number;
  /** Measured altitude (m). Array of arrays of altitude (double or null) values */
  altitudes?: (number | null)[][];
  /** Measured bike ride cadences (rpm). Array of arrays of cadence (int32 or null) values */
  cadence?: (number | null)[][];
  /** Measured bike rides heart rates (bpm). Array of arrays of heart rate (int32) values */
  heartRate?: number[][];
  /** Measured bike rides speeds (km/h). Array of arrays of speed (float) values */
  speed?: number[][];
  /** Latitudes and longitudes measured during the bike rides. Array of arrays of Coordinate objects or null */
  coordinates?: (Coordinate | null)[][];
  /** Motor power (W) during bike rides. Array of arrays of power (int32 or null) values */
  powerOutput?: (number | null)[][];
  /** Internal classification of the bike rider's fitness level */
  fitnessLevel?: number;
  /** Training related detail */
  trainingEffect?: number;
  /** Training related detail */
  trainingLoadPeak?: number;
  /** Weight factor for speed in the final formula of fitness level calculation */
  speedWeight?: number;
  /** Weight factor for cadence in the final formula of fitness level calculation */
  cadenceWeight?: number;
  /** Weight factor for heart rate in the final formula of fitness level calculation */
  heartRateWeight?: number;
  /** Weight factor for rider power weight (kg) in the final formula of fitness level calculation */
  riderPowerWeight?: number;
  /** Activity > 100m */
  isSignificant?: boolean;
  /** Total elevation gain (m) measured during the activity */
  elevationGain?: number;
  /** Total elevation loss (m) measured during the activity */
  elevationLoss?: number;
  /** Average power(W) output of the bike rider measured during the activity */
  avgRiderPower?: number;
  /** Drive unit decoded (ASCII) serial number */
  driveUnitSerialNumber?: string;
  /** Drive unit decoded (ASCII) part number */
  driveUnitPartNumber?: string;
}

export interface AssistanceLevel {
  level?: number;
  value?: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
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

  /**
   * Retrieve details of a single activity
   * @param id activity ID
   */
  getActivityDetails(id: number): Observable<ActivityDetail> {
    return this.http.get<ActivityDetail>(
      `${environment.eBikeApiUrl}/activity/ebike-system-2/v1/activities/${id}`,
    );
  }
}
