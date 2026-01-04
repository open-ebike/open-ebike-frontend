import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';
import { firstValueFrom, from, Observable } from 'rxjs';
import { EbikeProfiles } from './ebike-profile.service';

export interface Registrations {
  registrations: Registration[];
}

export type RegistrationType = 'BIKE_REGISTRATION' | 'COMPONENT_REGISTRATION';

export interface Registration {
  /** Allowed values: BIKE_REGISTRATION COMPONENT_REGISTRATION */
  registrationType: RegistrationType;
  /** Timestamp when bike or component has been registered. Only present if the requesting user registered the bike / component */
  createdAt: string;
  bikeRegistration?: BikeRegistration;
  componentRegistration?: ComponentRegistration;
}

export interface BikeRegistration {
  /** Bosch unique eBike system ID */
  bikeId: string;
}

export interface ComponentRegistration {
  /** The part number of the component */
  partNumber: string;
  /** The serial number of the component */
  serialNumber: string;
  componentType: 'DRIVE_UNIT';
}

//
// Cache
//

/**
 * Represents a database item
 */
interface DatabaseItem {
  /** Created at */
  createdAt: string;
  /** Registration */
  registration: Registration;
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
    super('ebike-registration-database');
    this.version(1).stores({
      items: 'createdAt',
      syncState: 'createdAt',
    });
  }
}

/**
 * Handles registrations
 */
@Injectable({
  providedIn: 'root',
})
export class EbikeRegistrationService {
  /** http client */
  http = inject(HttpClient);

  //
  // Access
  //

  /**
   * List all bike and component registrations
   */
  getRegistrations(): Observable<Registrations> {
    return from(
      liveQuery(async () => {
        const collection = this.database.items;
        const items = await collection.toArray();

        return {
          registrations: items.map((item) => {
            return item.registration;
          }),
        } as Registrations;
      }),
    );
  }

  //
  // API calls
  //

  /**
   * List all bike and component registrations
   */
  private fetchRegistrations() {
    return this.http.get<Registrations>(
      `${environment.eBikeApiUrl}/bike-registration/smart-system/v1/registrations`,
    );
  }

  //
  // Cache
  //

  /** Database */
  private database = new Database();
  /** Loading state */
  loading = signal<boolean>(false);
  /** Loaded state */
  loaded = signal<boolean>(false);

  /**
   * Fetches all items from API and stores them in IndexedDB
   */
  async fetchAll() {
    this.loading.set(true);

    try {
      // Fetch items
      const registrations = await firstValueFrom(this.fetchRegistrations());

      // Save fetched items to database
      const itemsToSave: DatabaseItem[] = registrations.registrations.map(
        (registration) => ({
          createdAt: registration.createdAt,
          registration: registration,
        }),
      );
      await this.database.items.bulkPut(itemsToSave);
      this.loading.set(false);
      this.loaded.set(true);
      return true;
    } catch {
      this.loading.set(false);
      return false;
    }
  }
}
