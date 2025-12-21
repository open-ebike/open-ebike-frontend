import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { EMPTY, expand, map, max, min, Observable, reduce } from 'rxjs';

/** Valid sort values for activity summary */
export type ActivitySummarySort =
  | 'startTime'
  | 'title'
  | 'distance'
  | 'durationWithoutStops'
  | '-startTime'
  | '-title'
  | '-distance'
  | '-durationWithoutStops';

export interface ActivitySummaries {
  /** Pagination meta data */
  pagination: Pagination;
  activitySummaries: ActivitySummary[];
  /** Generated links for pagination */
  links: Links;
}

export interface ActivitySummary {
  id: string;
  /** Starting time of the activity */
  startTime: string;
  /** End time of the activity */
  endTime: string;
  /** Timezone of start position, IANA */
  timeZone: string;
  /** Duration in motion in seconds */
  durationWithoutStops: string;
  /** Name of the activity */
  title: string;
  /** Bike uuid for the trip */
  bikeId: string;
  /** Odometer at start of activity in meters */
  startOdometer: number;
  speed: Speed;
  /** Odometer diff of activity in meters */
  distance: number;
  cadence: Cadence;
  riderPower: RiderPower;
  elevation: Elevation;
  caloriesBurned: number;
}

export interface Pagination {
  total: number;
  offset: number;
  limit: number;
}

export interface Speed {
  average: number;
  maximum: number;
}

export interface Speed {
  /** Average speed in km/h */
  average: number;
  /** Maximum speed in km/h */
  maximum: number;
}

export interface Cadence {
  /** Average cadence in rpm */
  average: number;
  /** Maximum cadence in rpm */
  maximum: number;
}

export interface RiderPower {
  /** Average rider power in watts */
  average: number;
  /** Maximum rider power in watts */
  maximum: number;
}

export interface Elevation {
  /** Elevation gain in m, only available with Mobile */
  gain: number;
  /** Elevation loss in m, only available with Mobile */
  loss: number;
}

export interface Links {
  self: string;
  prev: string;
  next: string;
  last: string;
  first: string;
}

export interface ActivityDetail {
  /** Distance from start in meters */
  distance: number;
  /** Altitude above sea level WGS84 in meters */
  altitude: number;
  /** Speed in km/h */
  speed: number;
  /** Cadence in rpm */
  cadence: number;
  /** Latitude in degrees, WGS84 */
  latitude: number;
  /** Longitude in degrees, WGS84 */
  longitude: number;
  /** Rider power in watts */
  riderPower: number;
}

export interface ActivityDetails {
  activityDetails: ActivityDetail[];
}

/**
 * Handles activity records
 */
@Injectable({
  providedIn: 'root',
})
export class ActivityRecordsService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Lists all activity summaries
   * @param limit limit
   * @param offset offset
   * @param sort sort
   */
  getAllActivitySummaries(
    limit?: number,
    offset?: number,
    sort?: ActivitySummarySort,
  ): Observable<ActivitySummaries> {
    let params = new HttpParams();
    if (limit != undefined) {
      params = params.set('limit', limit);
    }
    if (offset != undefined) {
      params = params.set('offset', offset);
    }
    if (sort != undefined) {
      params = params.set('sort', sort);
    }

    return this.http.get<ActivitySummaries>(
      `${environment.eBikeApiUrl}/activity/smart-system/v1/activities`,
      { params: params },
    );
  }

  /** Maximum limit of activity API calls */
  MAX_LIMIT = 100;

  /**
   * Lists all activity summaries
   * @param chunkSize chunk size
   * @param sort sort
   */
  getAllActivitySummariesRecursively(
    chunkSize: number = this.MAX_LIMIT,
    sort?: ActivitySummarySort,
  ): Observable<ActivitySummary[]> {
    chunkSize = Math.min(chunkSize, this.MAX_LIMIT);

    let offset = 0;
    let total = 0;

    return this.getAllActivitySummaries(chunkSize, offset, sort).pipe(
      expand((response) => {
        total = response.pagination.total || 0;
        offset = offset + chunkSize;

        if (offset < total) {
          return this.getAllActivitySummaries(chunkSize, offset, sort);
        } else {
          return EMPTY;
        }
      }),

      map((response) => response.activitySummaries),
      reduce((acc: ActivitySummary[], pageData: ActivitySummary[]) => {
        return acc.concat(pageData);
      }, []),
    );
  }

  /**
   * Retrieve details of a single activity
   * @param id activity ID
   */
  getActivityDetails(id: string): Observable<ActivityDetails> {
    return this.http.get<ActivityDetails>(
      `${environment.eBikeApiUrl}/activity/smart-system/v1/activities/${id}/details`,
    );
  }
}
