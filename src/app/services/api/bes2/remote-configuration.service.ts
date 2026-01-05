import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, from, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';

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
  originalConfiguration: OriginalConfiguration;
  componentIdentifications: ComponentIdentifications;
  remoteControlSystemId: string;
  driveUnit: string;
  brandId: string;
  brandName: string;
  isDualBatteryUpdateSupported: boolean;
}

export interface OriginalConfiguration {
  batteryLockNumber: string;
  lightEquipped: string;
  lightSwitching: string;
  lightOutput: string;
  lightPower: number;
  highPowerPortEnabled: boolean;
  driveOffEnabled: boolean;
  walkAssistEnabled: boolean;
  language:
    | 'GERMAN'
    | 'ENGLISH'
    | 'FRENCH'
    | 'ITALIAN'
    | 'SPANISH'
    | 'JAPANESE'
    | 'DUTCH'
    | 'INDEPENDENT'
    | 'DANISH'
    | 'SWEDISH'
    | 'PORTUGUESE';
  distanceUnit: 'KILOMETRE' | 'MILES' | 'UNSPECIFIED';
  defaultStarGear: number;
  manufactureDate: string;
  manufacturerBikeId: string;
  manufactureLocation: string;
  maximumGearRatio: number;
  minimumGearRatio: number;
  rearWheelCircumference: number;
  antiLockBrakingSystemVariant: number;
  freeText: string;
  applicationId: string;
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
  /** Cases */
  cases: Cases;
}

/**
 * Represents a database
 */
class DiagnosisEventsDatabase extends Dexie {
  /** Database items */
  items!: Table<DatabaseItem, string>;

  /**
   * Constructor
   */
  constructor() {
    super('bes2-remote-configuration-database');
    this.version(1).stores({
      items: '[duPartNumber+duSerialNumber]',
    });
  }
}

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
   * Gets all available remote configuration cases for an eBike System 2 bike
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getAllRemoteConfigurationCases(
    partNumber: string,
    serialNumber: string,
  ): Observable<Cases> {
    return from(
      liveQuery(async () => {
        return {
          cases: (
            await this.database.items.get({
              duPartNumber: partNumber,
              duSerialNumber: serialNumber,
            })
          )?.cases.cases!!,
        };
      }),
    );
  }

  //
  // API Calls
  //

  /**
   * Gets all available remote configuration cases for an eBike System 2 bike
   * @param partNumber part number
   * @param serialNumber serial number
   */
  private fetchAllRemoteConfigurationCases(
    partNumber: string,
    serialNumber: string,
  ): Observable<Cases> {
    let params = new HttpParams();
    params = params.set('partNumber', partNumber);
    params = params.set('serialNumber', serialNumber);

    return this.http.get<Cases>(
      `${environment.eBikeApiUrl}/remote-configuration/ebike-system-2/v1/cases`,
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
      // Fetch items
      const cases = await firstValueFrom(
        this.fetchAllRemoteConfigurationCases(partNumber, serialNumber),
      );

      // Save fetched items to database
      const itemToSave: DatabaseItem = {
        duPartNumber: partNumber,
        duSerialNumber: serialNumber,
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
