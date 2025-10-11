import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface ServiceRecords {
  serviceRecords: ServiceRecord[];
}

export interface ServiceRecord {
  id: string;
  type: string;
  attributes: Attributes;
}

export interface Attributes {
  bikeDealer: BikeDealer;
  bikeId: string;
  odometerValue: number;
  createdAt: string;
  details: Details;
}

export interface BikeDealer {
  name: string;
  street: string;
  city: string;
}

export interface Details {
  version: number;
  toolVersion: string;
  bike: Bike;
  actuatorTest: ActuatorTest;
  inspection: Inspection;
  softwareUpdate: SoftwareUpdate;
  customerReport: CustomerReport;
  bikeIdChange: BikeIdChange;
  batteryMeasurement: BatteryMeasurement;
}

export interface Bike {
  manufacturerBikeId: string;
  brandId: string;
}

export interface ActuatorTest {
  remoteControl: ActuatorTestResult[];
  driveUnit: ActuatorTestResult[];
  battery1: ActuatorTestResult[];
  battery2: ActuatorTestResult[];
  headUnit: ActuatorTestResult[];
  antiLockBrakeSystem: ActuatorTestResult[];
  connectModule: ActuatorTestResult[];
}

export interface ActuatorTestResult {
  testName?: string;
  overallResult?: string;
  note?: string;
  productName?: string;
  typeVariant?: string;
  stepResults?: StepResults;
}

export interface StepResults {
  antiLockBrakingSystemRearSensorStep: string;
  antiLockBrakingSystemWssFrontWheel: string;
  antiLockBrakingSystemWssRearWheel: string;
  batteryButtonPower: string;
  batteryLedBlue: string;
  driveUnitRimSensor: string;
  driveUnitReedSensor: string;
  driveUnitImuAntiLockBrakingSystemSensor: string;
  driveUnitLightPowerPortStep: string;
  remoteControlIlluminateSensor: string;
  remoteControlDarkenSensor: string;
  remoteControlButtonPlus: string;
  remoteControlButtonMode: string;
  remoteControlButtonMinus: string;
  remoteControlButtonLeft: string;
  remoteControlButtonRight: string;
  remoteControlButtonCenter: string;
  remoteControlButtonPower: string;
  remoteControlLedRed: string;
  remoteControlLedGreen: string;
  remoteControlLedBlue: string;
  remoteControlLedOrange: string;
  remoteControlLcdRed: string;
  remoteControlLcdGreen: string;
  remoteControlLcdBlue: string;
  remoteControlLcdWhite: string;
  remoteControlBuzzerOn: string;
  headUnitLcdRed: string;
  headUnitLcdGreen: string;
  headUnitLcdBlue: string;
  headUnitLcdWhite: string;
  headUnitBuzzerOn: string;
  headUnitButtonInfo: string;
  headUnitButtonLight: string;
  headUnitButtonReset: string;
  headUnitButtonWalk: string;
  headUnitButtonHome: string;
  headUnitButtonPlus: string;
  headUnitButtonMode: string;
  headUnitButtonMinus: string;
  headUnitButtonLeft: string;
  headUnitButtonRight: string;
  headUnitButtonCenter: string;
  headUnitButtonPower: string;
  headUnitJoystickUp: string;
  headUnitJoystickDown: string;
  headUnitJoystickLeft: string;
  headUnitJoystickRight: string;
  headUnitJoystickCenter: string;
}

export interface Inspection {
  inspections: InspectionDetail[];
}

export interface InspectionDetail {
  categoryType: string;
  typeVariant: string;
  services: Services;
  productName: string;
}

export interface Services {
  headUnitCheckDesignCover: string;
  headUnitCheckTurnOnOffBike: string;
  headUnitCheckButtons: string;
  headUnitCheckContacts: string;
  headUnitCheckMounting: string;
  headUnitCheckCables: string;
  remoteControlTurnOnOff: string;
  remoteControlCheckButtons: string;
  remoteControlCheckMounting: string;
  remoteControlCheckCables: string;
  remoteControlCheckDesignCover: string;
  batteryCheckMountingAndLock: string;
  batteryCheckTurnOnOffBike: string;
  batteryCheckCoverCap: string;
  batteryCheckHousing: string;
  batteryCheckCablesAndContacts: string;
  driveUnitCheckDesignCover: string;
  driveUnitCheckMounting: string;
  driveUnitCheckCrankGuides: string;
  driveUnitCheckCablesAndContacts: string;
  driveUnitCheckChainringIntakeAndLockring: string;
  driveUnitCheckChainringDamaged: string;
  driveUnitCheckBearingAndUpgrade: string;
  driveUnitCheckSpeedSensorAndMagnetPosition: string;
  antiLockBrakingSystemCheckIndicatorLampWorking: string;
  antiLockBrakingSystemCheckControlUnitMounting: string;
  antiLockBrakingSystemCheckControlUnitDamaged: string;
  antiLockBrakingSystemCheckSpeedSensors: string;
  antiLockBrakingSystemCheckCables: string;
  antiLockBrakingSystemCheckBrakeSystemWaterproofErosionNoise: string;
  connectModuleCheckHousing: string;
  connectModuleCheckMounting: string;
  connectModuleCheckCables: string;
  connectModuleCheckConnections: string;
  remoteControl3300CheckButtons: string;
  remoteControl3300CheckMounting: string;
  remoteControl3300CheckCables: string;
  headUnit3200CheckHousing: string;
  headUnit3200CheckContacts: string;
  headUnit3200CheckMounting: string;
  miscUpdateSoftware: string;
  miscPerformTestDrive: string;
  miscCheckWalkAssistAndLight: string;
  miscCheckLight: string;
  miscUpdateServiceInterval: string;
}

export interface SoftwareUpdate {
  client: Client;
  isForcedUpdate: boolean;
  bike: UpdatedBike;
}

export interface Client {
  type: string;
  version: string;
}

export interface UpdatedBike {
  brandId: string;
  manufacturerBikeId: string;
  bikeId: string;
  bikeCategory: string;
  updatedApplications: UpdatedApplications;
  updatedComponents: UpdatedComponent[];
}

export interface UpdatedApplications {
  product: ApplicationUpdate;
  gear: ApplicationUpdate;
  speed: ApplicationUpdate;
  assistModes: AssistModeUpdate[];
}

export interface ApplicationUpdate {
  id: string;
  longName: string;
  version: Version;
}

export interface Version {
  old: number | string;
  new: number | string;
  localizedReleaseNotes: string;
}

export interface AssistModeUpdate {
  id: string;
  longName: string;
  isActive: boolean;
  version: Version;
}

export interface UpdatedComponent {
  productCode: string;
  productName: string;
  partNumber: string;
  serialNumber: string;
  hardwareVersion: string;
  hardwareSoftwareVersion: string;
  bootloaderVersion: Version;
  softwareVersion: Version;
  localizedReleaseNotes: string;
}

export interface CustomerReport {
  metaData: MetaData;
  bike: CustomerBike;
  nextServiceInformation: NextServiceInformation;
}

export interface MetaData {
  toolCreationTimestamp: string;
  toolVersion: string;
  dataModelVersion: string;
  schemaVersion: number;
}

export interface CustomerBike {
  bikeInformation: DataPointContainer;
  individualInformation: DataPointContainer;
  additionalInformation: DataPointContainer;
  supportModes: SupportMode[];
  statistics: Statistics;
  components: CustomerComponent[];
}

export interface DataPointContainer {
  datapointValues: DatapointValue[];
}

export interface DatapointValue {
  id: string;
  value: string;
}

export interface SupportMode {
  isActive: boolean;
  id: string;
  version: number;
  shortName: string;
  longName: string;
  application: string;
  isUserAdjusted: boolean;
  userDefinedAssistModeValues: AssistModeValues;
  userDefinedAssistModeDefaults: AssistModeValues;
}

export interface AssistModeValues {
  accelerationResponse: number;
  assistLevel: number;
  maximumBikeSpeed: number;
  maximumMotorTorque: number;
  maximumMotorPower: number;
}

export interface Statistics {
  chartData: ChartData[];
  datapointValues: DatapointValue[];
}

export interface ChartData {
  distanceValue: number;
  energyValue: number;
  displayName: string;
  tooltipName: string;
}

export interface CustomerComponent {
  typeVariant: string;
  highestSpecialState: string;
  connected: boolean;
  softwareUpdateAvailable: boolean;
  productName: string;
  datapointValues: DatapointValue[];
}

export interface NextServiceInformation {
  daysNextService: number;
  metersNextService: number;
}

export interface BikeIdChange {
  remoteControlBikeId: string;
  newBikeId: string;
  typeVariantRemoteControl: string;
  replacedComponent: string;
}

export interface BatteryMeasurement {
  battery: BatteryInfo;
  measurement: Measurement;
}

export interface BatteryInfo {
  productCode: string;
  productName: string;
  partNumber: string;
  serialNumber: string;
  hardwareVersion: string;
  softwareVersion: string;
  bootloaderVersion: string;
  hardwareSoftwareVersion: string;
}

export interface Measurement {
  fullChargeCycles: number;
  measuredEnergyCapacity: number;
  nominalEnergyCapacity: number;
  measuredCapacityPercentage: number;
  onBikeMeasurement: boolean;
}

/**
 * Handles service records
 */
@Injectable({
  providedIn: 'root',
})
export class DigitalServiceBookService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Gets the service records of a Smart System bike
   * @param bikeId bike ID
   */
  getServiceRecords(bikeId: string) {
    return this.http.get<ServiceRecords>(
      `${environment.eBikeApiUrl}/service-book/smart-system/v1/service-records?bikeId=${bikeId}`,
    );
  }
}
