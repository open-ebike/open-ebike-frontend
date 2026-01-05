import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, from, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';

export type ComponentType = 'DRIVE_UNIT' | 'HEAD_UNIT' | 'BATTERY';

/**
 * Represents a list of eBike profiles
 */
export interface EbikeProfiles {
  bikes: EbikeProfile[];
}

/**
 * Represents an eBike profile
 */
export interface EbikeProfile {
  driveUnit: DriveUnit;
  headUnits: HeadUnit[];
  batteries: Battery[];
}

export interface BaseComponent {
  /** Component serial number. Matches the pattern: ^(\d{11,12}|\d{5} \d{4} \d{1,2}|[a-zA-Z0-9]{1,32})$ */
  serialNumber: string;
  /** Component part number */
  partNumber: string;
  /** Component type */
  type: string;
  /** Component name */
  deviceName: string;
}

export interface DriveUnit extends BaseComponent {
  /** Product line of the DriveUnit */
  productLineName: string;
  /** Manufacturer name of the bike */
  bikeManufacturer: string;
  /** Unlocked features for the specified drive unit */
  features: DriveUnitFeature[];
  /** Lock feature enabled/disabled */
  isLockFeatureEnabled?: boolean;
  /** Flag that shows if the bike is an S-pedelec */
  isSpedelec: boolean;
  /** Timestamps of the last changes when the settings were updated */
  settingsLastModifiedAt: DriveUnitSettingsLastModifiedAt;
  /** Maximum speed (percentage) of the drive unit */
  maxSpeedForUdam?: number; // format: int32
  /** Maximum assistance factor (percentage) of the drive unit */
  maxAssistFactor?: number; // format: int32
  /** Custom defined assistance level mappings. Only available with Nyon head unit */
  customAssistanceLevels?: AssistanceLevelMapping[][];
  /** Is service lock enabled/disabled */
  isServiceLockEnabled: boolean;
}

export type DriveUnitFeature = 'EMTB' | 'ELOCK';

export interface DriveUnitSettingsLastModifiedAt {
  bikeSettings?: string;
  customAssistanceLevels?: string;
}

export interface AssistanceLevelMapping {
  /** The speed in km/h at which the support will be changed to the percentage of force added */
  x?: number;
  /** The power the motor delivers */
  y?: number;
}

export interface HeadUnit extends BaseComponent {
  /** Name of the family of head units */
  deviceLineName: string;
  /** Navigation map version of the head unit */
  mapVersion: string;
  /** Memory capacity of the head unit */
  memoryCapacity?: string;
  /** Timestamp of the most recent moment when the head unit was synced */
  lastSyncedAt?: string;
  /** Timestamp of the most recent uploaded activity */
  lastActivityUploadedAt?: string;
}

export interface Battery extends BaseComponent {}

//
// Cache
//

/**
 * Represents a database item
 */
interface DatabaseItem {
  /** Part number */
  duPartNumber: string;
  /** Serial number */
  duSerialNumber: string;
  /** eBike profile */
  ebikeProfile: EbikeProfile;
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
    super('bes2-ebike-profile-database');
    this.version(1).stores({
      items: '[duPartNumber+duSerialNumber]',
    });
  }
}

/**
 * Handles eBike profiles
 */
@Injectable({
  providedIn: 'root',
})
export class EbikeProfileService {
  /** http client */
  http = inject(HttpClient);

  //
  // Access
  //

  /**
   * Retrieves details for bikes
   * @partNumber drive unit part number
   * @serialNumber drive unit serial number
   */
  getAllBikes(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<EbikeProfiles | undefined> {
    return from(
      liveQuery(async () => {
        if (partNumber != null && serialNumber != null) {
          return {
            bikes: [
              (
                await this.database.items.get({
                  duPartNumber: partNumber,
                  duSerialNumber: serialNumber,
                })
              )?.ebikeProfile,
            ].filter((item) => {
              return item !== undefined;
            }),
          };
        } else {
          return {
            bikes: (await this.database.items.toArray()).map((item) => {
              return item.ebikeProfile;
            }),
          };
        }
      }),
    );
  }

  //
  // API Calls
  //

  /**
   * Retrieves details for bikes
   * @partNumber drive unit part number
   * @serialNumber drive unit serial number
   */
  private fetchAllBikes(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<EbikeProfiles> {
    let params = new HttpParams();

    if (partNumber) {
      params = params.set('partNumber', partNumber);
    }
    if (serialNumber) {
      params = params.set('serialNumber', serialNumber);
    }

    return this.http.get<EbikeProfiles>(
      `${environment.eBikeApiUrl}/bike-profile/ebike-system-2/v1/bikes`,
      { params: params },
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
      const bikes = await firstValueFrom(this.fetchAllBikes());

      // Save fetched items to database
      const itemsToSave: DatabaseItem[] = bikes.bikes.map((bike) => {
        return {
          duPartNumber: bike.driveUnit.partNumber,
          duSerialNumber: bike.driveUnit.serialNumber,
          ebikeProfile: bike,
        };
      });

      await this.database.items.bulkPut(itemsToSave);
      this.loading.set(false);
      return true;
    } catch {
      this.loading.set(false);
      return false;
    }
  }
}
