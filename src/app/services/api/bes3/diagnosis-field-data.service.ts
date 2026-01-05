import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';
import { firstValueFrom, from, Observable } from 'rxjs';

export interface CapacityTesters {
  /** Payload containing the capacity tester data details of one measurement */
  capacityTesters: CapacityTester[];
}

export interface CapacityTester {
  /** Serial number of the Bosch Capacity Tester */
  capacityTesterSerialNumber: string;
  /** Contains the capacity tester data details of one measurement */
  capacityTesterData: CapacityTesterData;
  batteryData: BatteryData;
  /** Time of the creation of this item on the server. Used in response only */
  createdAt: string;
}

export interface CapacityTesterData {
  /** Total operation time of the capacity tester device in minutes */
  totalOperationTime: number;
  /** Number of successfully completed battery discharge cycles */
  numOfSuccessfulFinishedDischargeCycles: number;
  /** Number of successfully completed battery measurement cycles */
  numOfSuccessfulFinishedMeasurementCycles: number;
  /** Number of battery discharge cycles that were manually stopped by the user */
  numOfDischargeCyclesStopped: number;
  /** Number of battery discharge cycles that ended with errors */
  numOfDischargeCycleErrors: number;
  /** Number of battery measurement cycles that were manually stopped by the user */
  numOfMeasurementCyclesStopped: number;
  /** Number of battery measurement cycles that ended with errors */
  numOfMeasurementCycleErrors: number;
  /** Maximum measured battery management system current over life time (ext. ADC) in milliamperes */
  maxBmsCurrentExtAdc: number;
  /** Minimum measured battery management system current over life time (ext. ADC) in milliamperes */
  minBmsCurrentExtAdc: number;
  /** Maximum measured battery management system current over life time (int. ADC) in milliamperes */
  maxBmsCurrentIntAdc: number;
  /** Minimum measured battery management system current over life time (int. ADC) in milliamperes */
  minBmsCurrentIntAdc: number;
  /** Maximum measured battery management system voltage over life time (ext. ADC) in millivolts */
  maxBmsVoltageExtAdc: number;
  /** Maximum measured fan voltage over life time (int. ADC) in millivolts */
  maxFanVoltageIntAdc: number;
  /** Maximum temperature recorded by sensor 1 over life time in 10mK */
  maxTempSensor1: number;
  /** Minimum temperature recorded by sensor 1 over life time in 10mK */
  minTempSensor1: number;
  /** Maximum temperature recorded by sensor 2 over life time in 10mK */
  maxTempSensor2: number;
  /** Minimum temperature recorded by sensor 2 over life time in 10mK */
  minTempSensor2: number;
  /** Number of battery discharge cycles that were started by the user */
  numOfStartedDischargeCycles: number;
  /** Number of battery measurement cycles that were started by the user */
  numOfStartedMeasurementCycles: number;
  /** Number of battery discharge cycles interrupted due to battery disconnection */
  numOfInterruptedDischargeCyclesBatteryDisconnect: number;
  /** Number of battery measurement cycles interrupted due to battery disconnection */
  numOfInterruptedMeasurementCyclesBatteryDisconnect: number;
}

export interface BatteryData {
  /** Manufacturing date of the battery */
  manufacturingDate: string;
  /** Hardware version of the battery */
  hwVersion: string;
  /** Nominal capacity of the battery in watt-hours */
  nominalCapacity: number;
  /** Number of completed full charge cycles of the battery */
  fullChargeCycles: number;
  /** Manufacturer's part number of the battery */
  partNumber: string;
  /** Unique serial number of the battery */
  serialNumber: string;
  /** Software version of the battery management system */
  swVersion: string;
  /** Actual measured capacity of the battery in watt-hours */
  measuredCapacity: number;
  /** Indicates whether the measurement was conducted while the battery was installed on a bike */
  onBikeMeasurement: boolean;
}

//
// Cache
//

/**
 * Represents a database item
 */
interface DatabaseItem {
  /** Part number */
  partNumber: string;
  /** Serial number */
  serialNumber: string;
  /** Capacity testers */
  capacityTesters: CapacityTesters;
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
    super('bes3-diagnosis-field-data-database');
    this.version(1).stores({
      items: '[partNumber+serialNumber]',
    });
  }
}

/**
 * Handles field data
 */
@Injectable({
  providedIn: 'root',
})
export class DiagnosisFieldDataService {
  /** http client */
  http = inject(HttpClient);

  //
  // Access
  //

  /**
   * Gets all available battery measurement field data collected by Bosch Capacity Tester (Smart System)
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getFieldData(
    partNumber: string,
    serialNumber: string,
  ): Observable<CapacityTesters | undefined> {
    return from(
      liveQuery(async () => {
        return (
          await this.database.items.get({
            partNumber: partNumber,
            serialNumber: serialNumber,
          })
        )?.capacityTesters;
      }),
    );
  }

  //
  // API calls
  //

  /**
   * Gets all available battery measurement field data collected by Bosch Capacity Tester (Smart System)
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private fetchFieldData(partNumber: string, serialNumber: string) {
    return this.http.get<CapacityTesters>(
      `${environment.eBikeApiUrl}/diagnosis-field-data/smart-system/v1/capacity-testers?partNumber=${partNumber}&serialNumber=${serialNumber}`,
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
   * @param partNumber part number
   * @param serialNumber serial number
   */
  async fetch(partNumber: string, serialNumber: string) {
    this.loading.set(true);

    try {
      // Fetch items
      const capacityTesters = await firstValueFrom(
        this.fetchFieldData(partNumber, serialNumber),
      );

      // Save fetched items to database
      const itemToSave: DatabaseItem = {
        partNumber: partNumber,
        serialNumber: serialNumber,
        capacityTesters: capacityTesters,
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
