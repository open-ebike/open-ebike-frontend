import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, from, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';

export interface TuningResets {
  /** List of tracked tuning reset events. */
  tuningResets: Event[];
}

export interface BatteryDeactivations {
  /** List of tracked battery deactivation events. */
  batteryDeactivations: Event[];
}

export interface LockResets {
  /** List of tracked lock reset events. */
  lockResets: Event[];
}

export interface Event {
  timestamp?: TimestampEvent;
  partNumber?: EbikeSystem2PartNumber;
  serialNumber?: EbikeSystem2SerialNumber;
  productCode?: EbikeSystem2ProductCode;
  softwareVersion?: SoftwareVersion;
  hardwareVersion?: HardwareVersion;
}

export type TimestampEvent = string;

export type EbikeSystem2PartNumber = string;

export type EbikeSystem2SerialNumber = string;

export type EbikeSystem2ProductCode = string;

export type SoftwareVersion = string;

export type HardwareVersion = string;

//
// Cache
//

/**
 * Represents a database item
 */
interface TuningResetEventsDatabaseItem {
  /** Part number */
  duPartNumber: string;
  /** Serial number */
  duSerialNumber: string;
  /** Tuning resets */
  tuningResets: TuningResets;
}

/**
 * Represents a database item
 */
interface BatteryDeactivationEventsDatabaseItem {
  /** Part number */
  duPartNumber: string;
  /** Serial number */
  duSerialNumber: string;
  /** Battery deactivations */
  batteryDeactivations: BatteryDeactivations;
}

/**
 * Represents a database item
 */
interface LockResetEventsDatabaseItem {
  /** Part number */
  duPartNumber: string;
  /** Serial number */
  duSerialNumber: string;
  /** Lock resets */
  lockResets: LockResets;
}

/**
 * Represents a database
 */
class DiagnosisEventsDatabase extends Dexie {
  /** Database items */
  tuningResetEvents!: Table<TuningResetEventsDatabaseItem, string>;
  batteryDeactivationEvents!: Table<
    BatteryDeactivationEventsDatabaseItem,
    string
  >;
  lockResetEvents!: Table<LockResetEventsDatabaseItem, string>;

  /**
   * Constructor
   */
  constructor() {
    super('bes2-diagnosis-event-database');
    this.version(1).stores({
      tuningResetEvents: '[duPartNumber+duSerialNumber]',
      batteryDeactivationEvents: '[duPartNumber+duSerialNumber]',
      lockResetEvents: '[duPartNumber+duSerialNumber]',
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class DiagnosisEventService {
  /** http client */
  http = inject(HttpClient);

  //
  // Access
  //

  /**
   * Gets the tuning reset events of eBike System 2 drive units
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getAllTuningResetEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<TuningResets | undefined> {
    return from(
      liveQuery(async () => {
        if (partNumber != null && serialNumber != null) {
          return {
            tuningResets: (
              await this.database.tuningResetEvents.get({
                duPartNumber: partNumber,
                duSerialNumber: serialNumber,
              })
            )?.tuningResets.tuningResets!!,
          };
        } else {
          return {
            tuningResets: (
              await this.database.tuningResetEvents.toArray()
            ).flatMap((item) => {
              return item.tuningResets.tuningResets!!;
            }),
          };
        }
      }),
    );
  }

  /**
   * Gets the battery deactivation events of eBike System 2 batteries
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getAllBatteryDeactivationEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<BatteryDeactivations | undefined> {
    return from(
      liveQuery(async () => {
        if (partNumber != null && serialNumber != null) {
          return {
            batteryDeactivations: (
              await this.database.batteryDeactivationEvents.get({
                duPartNumber: partNumber,
                duSerialNumber: serialNumber,
              })
            )?.batteryDeactivations.batteryDeactivations!!,
          };
        } else {
          return {
            batteryDeactivations: (
              await this.database.batteryDeactivationEvents.toArray()
            ).flatMap((item) => {
              return item.batteryDeactivations.batteryDeactivations!!;
            }),
          };
        }
      }),
    );
  }

  /**
   * Get the lock reset events of eBike System 2 drive units
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getAllLockResetEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<LockResets | undefined> {
    return from(
      liveQuery(async () => {
        if (partNumber != null && serialNumber != null) {
          return {
            lockResets: (
              await this.database.lockResetEvents.get({
                duPartNumber: partNumber,
                duSerialNumber: serialNumber,
              })
            )?.lockResets.lockResets!!,
          };
        } else {
          return {
            lockResets: (await this.database.lockResetEvents.toArray()).flatMap(
              (item) => {
                return item.lockResets.lockResets!!;
              },
            ),
          };
        }
      }),
    );
  }

  //
  // API Calls
  //

  /**
   * Gets the tuning reset events of eBike System 2 drive units
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private fetchAllTuningResetEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<TuningResets> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params = params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params = params.set('serialNumber', serialNumber);
    }

    return this.http.get<TuningResets>(
      `${environment.eBikeApiUrl}/diagnosis-event/ebike-system-2/v1/tuning-resets`,
      { params: params },
    );
  }

  /**
   * Gets the battery deactivation events of eBike System 2 batteries
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private fetchAllBatteryDeactivationEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<BatteryDeactivations> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params = params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params = params.set('serialNumber', serialNumber);
    }

    return this.http.get<BatteryDeactivations>(
      `${environment.eBikeApiUrl}/diagnosis-event/ebike-system-2/v1/battery-deactivations`,
      { params: params },
    );
  }

  /**
   * Get the lock reset events of eBike System 2 drive units
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private fetchAllLockResetEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<LockResets> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params = params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params = params.set('serialNumber', serialNumber);
    }

    return this.http.get<LockResets>(
      `${environment.eBikeApiUrl}/diagnosis-event/ebike-system-2/v1/battery-deactivations`,
      { params: params },
    );
  }

  //
  // Cache
  //

  /** Database */
  private database = new DiagnosisEventsDatabase();
  /** Loading state */
  loading = signal<boolean>(false);

  /**
   * Fetches all items from API and stores them in IndexedDB
   * @param partNumber part number
   * @param serialNumber serial number
   */
  async fetch(partNumber: string, serialNumber: string) {
    this.loading.set(true);

    try {
      //
      // Tuning reset events
      //

      // Fetch items
      const tuningResetEvents = await firstValueFrom(
        this.fetchAllTuningResetEvents(partNumber, serialNumber),
      );

      // Save fetched items to database
      const tuningResetItemToSave: TuningResetEventsDatabaseItem = {
        duPartNumber: partNumber,
        duSerialNumber: serialNumber,
        tuningResets: tuningResetEvents,
      };

      await this.database.tuningResetEvents.put(tuningResetItemToSave);

      //
      // Lock reset events
      //

      // Fetch items
      const lockResetEvents = await firstValueFrom(
        this.fetchAllLockResetEvents(partNumber, serialNumber),
      );

      // Save fetched items to database
      const lockResetItemToSave: LockResetEventsDatabaseItem = {
        duPartNumber: partNumber,
        duSerialNumber: serialNumber,
        lockResets: lockResetEvents,
      };

      await this.database.lockResetEvents.put(lockResetItemToSave);

      //
      // Battery deactivation events
      //

      // Fetch items
      const batteryDeactivationEvents = await firstValueFrom(
        this.fetchAllBatteryDeactivationEvents(partNumber, serialNumber),
      );

      // Save fetched items to database
      const batteryDeactivationItemToSave: BatteryDeactivationEventsDatabaseItem =
        {
          duPartNumber: partNumber,
          duSerialNumber: serialNumber,
          batteryDeactivations: batteryDeactivationEvents,
        };

      await this.database.batteryDeactivationEvents.put(
        batteryDeactivationItemToSave,
      );

      this.loading.set(false);
      return true;
    } catch {
      this.loading.set(false);
      return false;
    }
  }
}
