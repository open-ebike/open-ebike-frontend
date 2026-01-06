import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';
import { Hubs } from './hub.service';

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

//
// Cache
//

/**
 * Represents a database item
 */
interface DatabaseItem {
  /** ID */
  id: string;
  /** Activities */
  activities: Activities;
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
    super('cobi-activities-database');
    this.version(1).stores({
      items: 'id',
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
   * Lists activities
   */
  getActivities(): Observable<Activities> {
    return from(
      liveQuery(async () => {
        return {
          activities: (await this.database.items.toArray()).flatMap((item) => {
            return item.activities.activities;
          }),
        };
      }),
    );
  }

  //
  // API Calls
  //

  /**
   * Lists activities
   */
  private fetchActivities(): Observable<Activities> {
    return this.http.get<Activities>(
      `${environment.eBikeApiUrl}/cobi/v1/activities`,
    );
  }

  //
  // Cache
  //

  /** Database */
  private database = new Database();
  /** Loading state */
  loading = signal<boolean>(false);

  /**
   * Fetches all items from API and stores them in IndexedDB
   */
  async fetchAll() {
    this.loading.set(true);

    try {
      // Fetch items
      const activities = await firstValueFrom(this.fetchActivities());

      // Save fetched items to database
      const itemToSave: DatabaseItem = {
        id: '0',
        activities: activities,
      };
      await this.database.items.put(itemToSave);
      this.loading.set(false);
      return true;
    } catch {
      this.loading.set(false);
      return false;
    }
  }
}
