import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, from, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';

export interface Hubs {
  /** The hubs of the user */
  hubs: Hub[];
}

export interface Hub {
  /** The serial number of the hub */
  serialNumber?: string;
  /** The part number of the hub */
  partNumber?: string;
  /** The role of the hub (is the user the owner or is the hub shared by another user) */
  role?: 'OWNER' | 'GUEST';
  /** The timestamp when the hub was activated */
  activatedAt?: string;
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
  /** Hubs */
  hubs: Hubs;
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
    super('cobi-hubs-database');
    this.version(1).stores({
      items: 'id',
      syncState: 'id',
    });
  }
}

/**
 * Handles hubs
 */
@Injectable({
  providedIn: 'root',
})
export class HubService {
  /** http client */
  http = inject(HttpClient);

  //
  // Access
  //

  /**
   * Lists hubs
   */
  getHubs(): Observable<Hubs> {
    return from(
      liveQuery(async () => {
        return {
          hubs: (await this.database.items.toArray()).flatMap((item) => {
            return item.hubs.hubs;
          }),
        };
      }),
    );
  }

  //
  // API Calls
  //

  /**
   * Lists hubs
   */
  private fetchHubs(): Observable<Hubs> {
    return this.http.get<Hubs>(`${environment.eBikeApiUrl}/cobi/v1/hubs`);
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
      const hubs = await firstValueFrom(this.fetchHubs());

      // Save fetched items to database
      const itemToSave: DatabaseItem = {
        id: '0',
        hubs: hubs,
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
