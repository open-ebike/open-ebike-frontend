import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom, from, Observable } from 'rxjs';
import Dexie, { liveQuery, Table } from 'dexie';

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
  durationWithoutStops: number;
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

//
// Cache
//

/**
 * Represents a database item
 */
interface DatabaseItem {
  /** ID */
  id: string;
  /** Start time */
  startTime: string;
  /** Activity summary */
  activitySummary: ActivitySummary;
  /** Activity details */
  activityDetails: ActivityDetail[];
}

/**
 * Represents a database
 */
class Database extends Dexie {
  /** Database items */
  items!: Table<DatabaseItem, string>;

  /**
   * Constructor
   */
  constructor() {
    super('bes3-activity-records-database');
    this.version(1).stores({
      items: 'id, startTime',
      syncState: 'id',
    });
  }
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

  //
  // Access
  //

  /**
   * Lists all activity summaries
   * @param limit limit
   * @param offset offset
   */
  getAllActivitySummaries(
    limit: number = 20,
    offset: number = 0,
  ): Observable<ActivitySummaries> {
    return from(
      liveQuery(async () => {
        const collection = this.database.items.orderBy('startTime').reverse();

        const [items, totalCount] = await Promise.all([
          collection.offset(offset).limit(limit).toArray(),
          this.database.items.count(),
        ]);

        return {
          activitySummaries: items.map((item) => {
            return item.activitySummary;
          }),
          pagination: {
            total: totalCount,
            offset: offset,
            limit: limit,
          },
          links: {},
        } as ActivitySummaries;
      }),
    );
  }

  /**
   * Retrieve details of a single activity
   * @param id activity ID
   */
  getActivityDetails(id: string): Observable<ActivityDetails> {
    return from(
      liveQuery(async () => {
        return {
          activityDetails: (await this.database.items.get(id))?.activityDetails,
        } as ActivityDetails;
      }),
    );
  }

  //
  // API calls
  //

  /**
   * Lists all activity summaries
   * @param limit limit
   * @param offset offset
   * @param sort sort
   */
  private fetchAllActivitySummaries(
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

  /**
   * Retrieve details of a single activity
   * @param id activity ID
   */
  private fetchActivityDetails(id: string): Observable<ActivityDetails> {
    return this.http.get<ActivityDetails>(
      `${environment.eBikeApiUrl}/activity/smart-system/v1/activities/${id}/details`,
    );
  }

  //
  // Cache
  //

  /** Database */
  private database = new Database();
  /** Actual item count */
  itemCount = signal(0);
  /** Total item count */
  totalItemCount = signal(0);
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
    return (
      this.totalItemCount() != 0 && this.itemCount() != this.totalItemCount()
    );
  });
  /** Loaded state */
  loaded = signal<boolean>(false);

  /** Chunk size */
  CHUNK_SIZE = 20;

  /**
   * Fetches all items from API and stores them in IndexedDB
   */
  async fetchAll() {
    try {
      // Update actual items count
      this.itemCount.set(await this.database.items.count());

      // Get the latest known date
      const mostRecentItem = await this.database.items
        .orderBy('startTime')
        .reverse()
        .first();
      const latestKnownDate = mostRecentItem ? mostRecentItem.startTime : null;

      let pageIndex = 0;
      let keepFetching = true;

      while (keepFetching) {
        // Fetch page
        const page = await firstValueFrom(
          this.fetchAllActivitySummaries(this.CHUNK_SIZE, pageIndex),
        );

        // Update total items count
        this.totalItemCount.set(page.pagination.total);

        // Check if page is empty
        if (!page || page.activitySummaries.length === 0) {
          keepFetching = false;
          break;
        }

        // Save fetched items to database
        const itemsToSave: DatabaseItem[] = await Promise.all(
          page.activitySummaries.map(async (activitySummary) => ({
            id: activitySummary.id,
            startTime: activitySummary.startTime,
            activitySummary: activitySummary,
            activityDetails: (
              await firstValueFrom(
                this.fetchActivityDetails(activitySummary.id),
              )
            ).activityDetails,
          })),
        );
        await this.database.items.bulkPut(itemsToSave);

        // Update actual items count
        this.itemCount.set(await this.database.items.count());

        // Check for overlap
        if (latestKnownDate) {
          if (itemsToSave.find((i) => i.startTime <= latestKnownDate!!)) {
            keepFetching = false;
          } else {
            pageIndex++;
          }
        } else {
          pageIndex++;
        }
      }
      this.loaded.set(true);
      return true;
    } catch {
      return false;
    }
  }
}
