import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom, from, Observable } from 'rxjs';
import Dexie, { liveQuery, Table } from 'dexie';

export type ComponentType =
  | 'DRIVE_UNIT'
  | 'REMOTE_CONTROL'
  | 'BATTERY'
  | 'ANTI_LOCK_BRAKE_SYSTEM'
  | 'CONNECT_MODULE'
  | 'HEAD_UNIT';

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
  /** Bosch unique eBike ID */
  id: string;
  /** OEM unique eBike ID */
  oemId: string;
  /** Date the Cloud API first received bike data from the Flow app */
  createdAt: string;
  /** Language used within the eBike system */
  language: string;
  /** Service due */
  serviceDue: ServiceDue;
  /** The eBike drive unit */
  driveUnit: DriveUnit;
  /** Remote Control (also known as Thumb Controller). Used to allow riders to control the eBike settings without a third-party device */
  remoteControl: RemoteControl;
  /** Batteries of a bike */
  batteries: Battery[];
  /** Anti-lock Braking System (Commonly abbreviated as "ABS"). Stands for more riding safety while enabling controlled and stable braking even under difficult conditions */
  antiLockBrakeSystems: AntiLockBrakeSystem[];
  /** Bosch ConnectModule (Hardware component to send telemetry data from the eBike without relying on a smartphone for internet connection) */
  connectModule: ConnectModule;
  /** Head Unit (display on the eBike to allow riding without needing a smartphone) */
  headUnit: HeadUnit;
}

/**
 * Represents a service due
 */
export interface ServiceDue {
  /** Point in time in UTC after service is due */
  date: Date;
  /** The total distance in meters after which service is due */
  odometer: number;
}

/**
 * Represents a drive unit
 */
export interface DriveUnit {
  productName: string;
  serialNumber: string;
  partNumber: string;
  walkAssistConfiguration: WalkAssistConfiguration;
  /** The total distance in meters */
  odometer: number;
  /** Wheel circumference in mm */
  rearWheelCircumferenceUser: number;
  /** The maximum assistance speed in km/h */
  maximumAssistanceSpeed: number;
  /** Reachable range in meters per active assist mode sorted by weakest to strongest assist mode */
  activeAssistModes: ActiveAssistMode[];
  powerOnTime: PowerOnTime;
}

/**
 * Represents a walk assist configuration
 */
export interface WalkAssistConfiguration {
  /** A boolean indicating if the walk assist is enabled */
  isEnabled: boolean;
  /** Maximum bike speed of the walk assist in km/h */
  maximumSpeed: number;
}

/**
 * Represents an active assist mode
 */
export interface ActiveAssistMode {
  /** Name of the assist mode */
  name: string;
  /** Provides the reachable range in meters */
  reachableRange: number;
}

/**
 * Represents power-on time
 */
export interface PowerOnTime {
  /** The power-on time in hours */
  total: number;
  withMotorSupport: number;
}

/**
 * Represents a remote control
 */
export interface RemoteControl {
  productName: string;
  serialNumber: string;
  partNumber: string;
}

/**
 * Represents a battery
 */
export interface Battery {
  productName: string;
  serialNumber: string;
  partNumber: string;
  /** The delivered Wh over lifetime */
  deliveredWhOverLifetime: number;
  chargeCycles: ChargeCycles;
}

export interface ChargeCycles {
  /** The total number of full charge cycles */
  total: number;
  /** The number of full charge cycles of the battery while charging on bike */
  onBike: number;
  /** The number of full charge cycles of the battery while charging stand-alone/off bike */
  offBike: number;
}

/**
 * Represents an anti-lock braking system
 */
export interface AntiLockBrakeSystem {
  productName: string;
  serialNumber: string;
  partNumber: string;
}

/**
 * Represents a connect module
 */
export interface ConnectModule {
  productName: string;
  serialNumber: string;
  partNumber: string;
}

/**
 * Represents a head unit
 */
export interface HeadUnit {
  productName: string;
  serialNumber: string;
  partNumber: string;
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
    super('bes3-ebike-profile-database');
    this.version(1).stores({
      items: 'id',
      syncState: 'id',
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
   * Lists all bikes
   */
  getAllBikes(): Observable<EbikeProfiles> {
    return from(
      liveQuery(async () => {
        const collection = this.database.items;
        const items = await collection.toArray();

        return {
          bikes: items.map((item) => {
            return item.ebikeProfile;
          }),
        } as EbikeProfiles;
      }),
    );
  }

  /**
   * Retrieve a single eBike
   * @param bikeId bike ID
   */
  getBike(bikeId: string): Observable<EbikeProfile | undefined> {
    return from(
      liveQuery(async () => {
        return (await this.database.items.get(bikeId))?.ebikeProfile;
      }),
    );
  }

  //
  // API calls
  //

  /**
   * Lists all bikes
   */
  private fetchAllBikes(): Observable<EbikeProfiles> {
    return this.http.get<EbikeProfiles>(
      `${environment.eBikeApiUrl}/bike-profile/smart-system/v1/bikes`,
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
      const ebikes = await firstValueFrom(this.fetchAllBikes());

      // Save fetched items to database
      const itemsToSave: DatabaseItem[] = ebikes.bikes.map((ebike) => ({
        id: ebike.id,
        ebikeProfile: ebike,
      }));
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
