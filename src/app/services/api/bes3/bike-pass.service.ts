import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import Dexie, { liveQuery, Table } from 'dexie';
import { firstValueFrom, from, Observable } from 'rxjs';

export interface BikePasses {
  /** List of bike passes for the requested bike */
  bikePasses: BikePass[];
}

export interface BikePass {
  /** The Smart System bike's globally unique ID (RFC 4122-compliant UUID) aka. Bosch System ID */
  bikeId: string;
  /** Unique identifier for the bike's frame */
  frameNumber: string;
  /** Position of unique identifier for the bike's frame */
  frameNumberPosition: string;
  /** Description of special attributes of the bike */
  description: string;
  /** Timestamp when bikes pass has been created */
  createdAt: string;
  /** Timestamp when bike pass has been updated (latest update) */
  updatedAt: string;
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
  /** Bike passes */
  bikePasses: BikePasses;
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
    super('bikePassDatabase');
    this.version(1).stores({
      items: 'id',
      syncState: 'id',
    });
  }
}

/**
 * Handles bike passes
 */
@Injectable({
  providedIn: 'root',
})
export class BikePassService {
  /** http client */
  http = inject(HttpClient);

  //
  // Access
  //

  /**
   * Gets bike passes for a Smart System bike
   * @param bikeId bike ID
   */
  getBikePasses(bikeId: string): Observable<BikePasses | undefined> {
    return from(
      liveQuery(async () => {
        return (await this.database.items.get(bikeId))?.bikePasses;
      }),
    );
  }

  //
  // API calls
  //

  /**
   * Gets bike passes for a Smart System bike
   * @param bikeId bike ID
   */
  private fetchBikePasses(bikeId: string) {
    return this.http.get<BikePasses>(
      `${environment.eBikeApiUrl}/bike-pass/smart-system/v1/bike-passes?bikeId=${bikeId}`,
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
   * @param bikeId bike ID
   */
  async fetch(bikeId: string) {
    this.loading.set(true);

    try {
      // Fetch items
      const bikePasses = await firstValueFrom(this.fetchBikePasses(bikeId));

      // Save fetched items to database
      const itemToSave: DatabaseItem = {
        id: bikeId,
        bikePasses: bikePasses,
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
