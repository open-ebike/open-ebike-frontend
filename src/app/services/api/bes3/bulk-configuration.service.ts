import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';
import { firstValueFrom, from, Observable } from 'rxjs';
import { BikePasses } from './bike-pass.service';

export interface BulkInstallationReports {
  installationReports: BulkInstallationReport[];
}

export interface BulkInstallationReport {
  userAgent: string;
  bikeComponents: BikeComponents;
  bikeProperties: BikeProperties;
  manufactureInformation: ManufactureInformation;
  updateInformation: UpdateInformation;
  failureInformation: FailureInformation;
}

export interface Component {
  productCode: string;
  serialNumber: string;
  partNumber: string;
  softwareVersion: string;
}

export interface BikeComponents {
  remoteControl: Component;
  driveUnit: Component;
  antiLockBrakingSystem: Component;
}

export interface BikeProperties {
  brandId: string;
  manufacturerBikeModelId: string;
  productId: string;
  speedRegionId: string;
  gearshiftId: string;
  bikeCategory: 'CITY';
  maximumMotorTorqueStatus: 'UNINITIALIZED';
  maximumMotorTorque: number;
  driveUnitProductCode: string;
}

export interface ManufactureInformation {
  manufacturerBikeModelId: string;
  manufacturerBikeId: string;
  batteryKeyLockNumber: string;
}

export interface UpdateInformation {
  installedAt: string;
  manufactureDate: string;
  bikeId: string;
  originalConfiguration: OriginalConfiguration;
  originalManufactureInformation: Record<string, unknown>;
}

export interface FailureInformation {
  failedAt: string;
  bikeId: string;
}

export interface OriginalConfiguration {
  antiLockBrakingSystemBuiltIn: boolean;
  antiLockBrakingSystemCalibration: string;
  antiLockBrakingSystemMode: string;
  assistModes: AssistMode[];
  antiLockBrakingSystemCalibrationChecksum: number;
  isAssistModesConfigurable: boolean;
  bikeCategory: string;
  bikeCategoryChecksum: number;
  brakeHoseLengthFromCaliper: number;
  brakeHoseLengthFromCaliperChecksum: number;
  brakeHoseLengthFromMasterCylinder: number;
  brakeHoseLengthFromMasterCylinderChecksum: number;
  rangeExtenderReadiness: boolean;
  displayLanguage: string;
  frontBrakeDiscCalliper: string;
  frontBrakeDiscCalliperChecksum: number;
  frontBrakeDiscDiameter: number;
  frontBrakeDiscDiameterChecksum: number;
  frontWheelCircumference: number;
  frontWheelCircumferenceChecksum: number;
  gearshiftApplication: Application;
  isHighPowerPortConfigurable: boolean;
  lengthUnit: string;
  lightAttached: boolean;
  lightPower: number;
  lightStatus: string;
  isLightConfigurable: boolean;
  isLowPowerPortConfigurable: boolean;
  multiPurposePortStatus: string;
  isMultiPurposePortConfigurable: boolean;
  maxGearTransmissionRatio: number;
  speedRegionApplication: SpeedRegionApplication;
  name: string;
  productionSite: string;
  productApplication: Application;
  rearWheelCircumference: number;
  rearWheelCircumferenceChecksum: number;
  speedSource: string;
  secondSpeedSource: string;
  timeFormat: string;
  imuAsAbsSpeedSource: boolean;
  mountingAngle: number;
  mountingAngleChecksum: number;
  maximumBikeSpeed: number;
  walkAssistEnabled: boolean;
  walkAssistSpeed: number;
  maximumMotorTorque: number;
  maximumMotorTorqueStatus: string;
  throttleReadiness: string;
  hubConfigurablePortConfiguration: string;
  isHubConfigurablePortConfigurable: boolean;
  mountingAngleRoll: number;
  mountingAngleRollChecksum: number;
  motorProductCode: string;
  dbChecksum: string;
  excludedFromProduction: boolean;
  folder: string;
  gearshiftTypeId: string;
  itemNumbers: ItemNumber[];
  regioSpeedId: string;
  productApplicationId: string;
  boschDiagnosisToolVersion: string;
  dongleId: string;
  connectBleDevices: boolean;
  numberOfBleDevices: number;
  oemTorqueLimitation: number;
  oemTorqueLimitationStatus: string;
  connectModuleReadiness: boolean;
  lowPowerPortStatus: boolean;
  highPowerPortStatus: boolean;
}

export interface AssistMode {
  id: string;
  version: number;
  availableOnRemoteControl: boolean;
  availableOnBike: boolean;
  name: string;
}

export interface Application {
  id: string;
  version: number;
}

export interface SpeedRegionApplication {
  id: string;
  version: number;
  maximumLegalBikeSpeed: number;
  maximumAssistanceSpeed: number;
  udamModificationPossible: boolean;
  walkAssistConfigurable: boolean;
}

export interface ItemNumber {
  value: string;
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
  /** Bulk */
  installationReports: BulkInstallationReports;
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
    super('bulkConfigurationDatabase');
    this.version(1).stores({
      items: 'id',
      syncState: 'id',
    });
  }
}

/**
 * Handles installation reports of a bulk configuration
 */
@Injectable({
  providedIn: 'root',
})
export class BulkConfigurationService {
  /** http client */
  http = inject(HttpClient);

  //
  // Access
  //

  /**
   * Gets installation reports of a bulk configuration change for a Smart System bike
   * @param bikeId bike ID
   */
  getInstallationReports(
    bikeId: string,
  ): Observable<BulkInstallationReports | undefined> {
    return from(
      liveQuery(async () => {
        return (await this.database.items.get(bikeId))?.installationReports;
      }),
    );
  }

  //
  // API calls
  //

  /**
   * Gets installation reports of a bulk configuration change for a Smart System bike
   * @param bikeId bike ID
   */
  private fetchInstallationReports(bikeId: string) {
    return this.http.get<BulkInstallationReports>(
      `${environment.eBikeApiUrl}/bulk-configuration/smart-system/v1/installation-reports?bikeId=${bikeId}`,
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
      const installationReports = await firstValueFrom(
        this.fetchInstallationReports(bikeId),
      );

      // Save fetched items to database
      const itemToSave: DatabaseItem = {
        id: bikeId,
        installationReports: installationReports,
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
