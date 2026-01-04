import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';
import { firstValueFrom, from, Observable } from 'rxjs';

export interface Cases {
  cases: Case[];
}

export interface Case {
  caseId: string;
  createdAt: string;
  lastModified: string;
  manufacturerBikeId: string;
  bikeGeneration: string;
  bikeDealer: string;
  denyingReason: string;
  state: string;
  manufacturerMetaData: string;
  originalConfiguration: Configuration;
  updatedConfiguration: UpdatedConfiguration;
}

export interface Configuration {
  schemaVersion: number;
  bikeProductionData: BikeProductionData;
  identificationDatas: IdentificationData[];
  componentIdentifications: ComponentIdentifications;
  remoteControlSystemId: string;
  driveUnit: string;
  brandId: string;
  brandName: string;
  isDualBatteryUpdateSupported: boolean;
}

export interface BikeProductionData {
  configurationData: ConfigurationData;
  manufactureDate: ManufactureDate;
  oemBikeModelId: string;
  bikeId: string;
  note: string;
  batteryKeyLockNumber: string;
  superfluousBleDevices: string[];
  bleMacAddresses: string[];
}

export interface ConfigurationData {
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
  connectModuleReadiness: string;
  highPowerPortStatus: string;
  lowPowerPortStatus: string;
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

export interface ManufactureDate {
  value: string;
}

export interface IdentificationData {
  serialNumber: string;
  partNumber: string;
  productCode: string;
  softwareVersion: string;
  hardwareSoftwareVersion: string;
  hardwareVersion: string;
  bootloaderVersion: string;
  inBootloaderMode: boolean;
}

export interface ComponentIdentifications {
  remoteControl: IdentificationData;
  driveUnit: IdentificationData;
  batteryPack1: IdentificationData;
  batteryPack2: IdentificationData;
  headUnit: IdentificationData;
  connectModule: IdentificationData;
  antiLockBrakingSystem: IdentificationData;
}

export interface UpdatedConfiguration {
  schemaVersion: number;
  bikeProductionData: BikeProductionData;
  identificationDatas: IdentificationData[];
  componentIdentifications: ComponentIdentifications;
  driveUnitBackup: string;
  oldRemoteControlSystemId: string;
  oldDriveUnitSystemId: string;
  brandId: string;
  newBikeId: string;
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
  /** Cases */
  cases: Cases;
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
    super('remote-configuration-database');
    this.version(1).stores({
      items: 'id',
      syncState: 'id',
    });
  }
}

/**
 * Handles remote configurations
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteConfigurationService {
  /** http client */
  http = inject(HttpClient);

  //
  // Access
  //

  /**
   * Gets all available remote configuration cases for a Smart System bike
   * @param bikeId bike ID
   */
  getRemoteConfigurationCases(bikeId: string): Observable<Cases | undefined> {
    return from(
      liveQuery(async () => {
        return (await this.database.items.get(bikeId))?.cases;
      }),
    );
  }

  //
  // API calls
  //

  /**
   * Gets all available remote configuration cases for a Smart System bike
   * @param bikeId bike ID
   */
  private fetchRemoteConfigurationCases(bikeId: string) {
    let params = new HttpParams();
    params = params.set('bikeId', bikeId);

    return this.http.get<Cases>(
      `${environment.eBikeApiUrl}/remote-configuration/smart-system/v1/cases`,
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
   * @param bikeId bike ID
   */
  async fetch(bikeId: string) {
    this.loading.set(true);

    try {
      // Fetch items
      const cases = await firstValueFrom(
        this.fetchRemoteConfigurationCases(bikeId),
      );

      // Save fetched items to database
      const itemToSave: DatabaseItem = {
        id: bikeId,
        cases: cases,
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
