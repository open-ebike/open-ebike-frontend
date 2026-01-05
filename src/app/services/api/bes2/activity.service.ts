import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { firstValueFrom, from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Dexie, { liveQuery, Table } from 'dexie';

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

export interface Statistics {
  currentMonth?: MonthlyStatistics;
  lastMonth?: MonthlyStatistics;
  /** Best overall month for bike riding */
  bestMonth?: number;
  /** Month with the longest activity distance (m) uploaded */
  bestMonthDistance?: number;
  totalStatistics?: TotalStatistics;
  /** Bike rider's first name */
  firstName?: string;
  /** Bike rider's last name */
  lastName?: string;
  /** Timestamp of the start time of the last activity uploaded */
  lastActivityTimestamp?: string;
  /** Activity length (m) of the activities uploaded in the last 30 days */
  last30DaysDistances?: number[];
}

export interface MonthlyStatistics {
  /** Month index, starting at 1 */
  month?: number;
  /** Total distance (m) covered across all activities completed in the month */
  distance?: number;
  /** Average speed (km/h) calculated across all activities completed in the month */
  avgSpeed?: number;
  /** Total calories burned covered across all activities completed in the month */
  caloriesBurned?: number;
  /** Total elevation gained (m) covered across all activities completed in the month */
  elevationGain?: number;
}

export interface TotalStatistics {
  /** Total distance (m) of all activities combined */
  distance?: number;
  /** Total elevation gained (m) of all activities combined */
  elevationGain?: number;
  /** Total distance (m) of all activities created in the current year combined */
  yearlyDistance?: number;
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
  activityDetails: ActivityDetail;
}

/**
 * Represents a database item
 */
interface StatisticsDatabaseItem {
  /** ID */
  id: string;
  /** Statistics */
  statistics: Statistics;
}

/**
 * Represents a database
 */
class Database extends Dexie {
  /** Database items */
  items!: Table<DatabaseItem, string>;
  statistics!: Table<StatisticsDatabaseItem, string>;

  /**
   * Constructor
   */
  constructor() {
    super('bes2-activity-database');
    this.version(1).stores({
      items: 'id, startTime',
      syncState: 'id',
    });
  }
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
          activities: items.map((item) => {
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
  getActivityDetails(id: number): Observable<ActivityDetail> {
    return from(
      liveQuery(async () => {
        return (await this.database.items.get(id.toString()))
          ?.activityDetails as ActivityDetail;
      }),
    );
  }

  /**
   * Lists statistics
   */
  getStatistics(): Observable<Statistics | undefined> {
    return from(
      liveQuery(async () => {
        return (await this.database.statistics.get('0'))?.statistics;
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
   */
  private fetchAllActivitySummaries(
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
  private fetchActivityDetails(id: number): Observable<ActivityDetail> {
    return this.http.get<ActivityDetail>(
      `${environment.eBikeApiUrl}/activity/ebike-system-2/v1/activities/${id}`,
    );
  }

  /**
   * Lists statistics
   */
  private fetchStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(
      `${environment.eBikeApiUrl}/activity/ebike-system-2/v1/statistics`,
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
  totalItemCount = signal(-1);
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
    return this.itemCount() != this.totalItemCount();
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
        if (!page || page.activities.length === 0) {
          keepFetching = false;
          break;
        }

        // Save fetched items to database
        const itemsToSave: DatabaseItem[] = await Promise.all(
          page.activities.map(async (activity) => ({
            id: activity.id.toString(),
            startTime: activity.startTime,
            activitySummary: activity,
            activityDetails: await firstValueFrom(
              this.fetchActivityDetails(activity.id),
            ),
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

      //
      // Statistics
      //

      // Fetch items
      const statistics = await firstValueFrom(this.fetchStatistics());

      // Save fetched items to database
      const itemToSave: StatisticsDatabaseItem = {
        id: '0',
        statistics: statistics,
      };
      await this.database.statistics.put(itemToSave);

      this.loaded.set(true);
      return true;
    } catch {
      return false;
    }
  }
}
