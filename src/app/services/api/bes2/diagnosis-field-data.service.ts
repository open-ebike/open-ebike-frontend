import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CapacityTesterFieldDataResponse {
  /** List of battery measurement data by the Bosch Capacity Tester. */
  capacityTesters: CapacityTesterFieldData[];
}

export interface CapacityTesterFieldData {
  /** Serial number of the Bosch Capacity Tester. */
  capacityTesterSerialNumber?: string;
  capacityTesterData?: CapacityTesterDataDetails;
  batteryData?: BatteryDataDetails;
  createdAt?: TimestampServer;
}

export type TimestampServer = string;

export interface CapacityTesterDataDetails {
  /** Total operation time of the capacity tester device in minutes. */
  totalOperationTime?: number;
  /** Number of successfully completed battery discharge cycles. */
  numOfSuccessfulFinishedDischargeCycles?: number;
  /** Number of successfully completed battery measurement cycles. */
  numOfSuccessfulFinishedMeasurementCycles?: number;
  /** Number of battery discharge cycles that were manually stopped by the user. */
  numOfDischargeCyclesStopped?: number;
  /** Number of battery discharge cycles that ended with errors. */
  numOfDischargeCycleErrors?: number;
  /** Number of battery measurement cycles that were manually stopped by the user. */
  numOfMeasurementCyclesStopped?: number;
  /** Number of battery measurement cycles that ended with errors. */
  numOfMeasurementCycleErrors?: number;
  /** Maximum measured battery management system current over life time (ext. ADC) in milliamperes. */
  maxBmsCurrentExtAdc?: number;
  /** Minimum measured battery management system current over life time (ext. ADC) in milliamperes. */
  minBmsCurrentExtAdc?: number;
  /** Maximum measured battery management system current over life time (int. ADC) in milliamperes. */
  maxBmsCurrentIntAdc?: number;
  /** Minimum measured battery management system current over life time (int. ADC) in milliamperes. */
  minBmsCurrentIntAdc?: number;
  /** Maximum measured battery management system voltage over life time (ext. ADC) in millivolts. */
  maxBmsVoltageExtAdc?: number;
  /** Maximum measured fan voltage over life time (int. ADC) in millivolts. */
  maxFanVoltageIntAdc?: number;
  /** Maximum temperature recorded by sensor 1 over life time in 10mK. */
  maxTempSensor1?: number;
  /** Minimum temperature recorded by sensor 1 over life time in 10mK. */
  minTempSensor1?: number;
  /** Maximum temperature recorded by sensor 2 over life time in 10mK. */
  maxTempSensor2?: number;
  /** Minimum temperature recorded by sensor 2 over life time in 10mK. */
  minTempSensor2?: number;
  /** Number of battery discharge cycles that were started by the user. */
  numOfStartedDischargeCycles?: number;
  /** Number of battery measurement cycles that were started by the user. */
  numOfStartedMeasurementCycles?: number;
  /** Number of battery discharge cycles interrupted due to battery disconnection. */
  numOfInterruptedDischargeCyclesBatteryDisconnect?: number;
  /** Number of battery measurement cycles interrupted due to battery disconnection. */
  numOfInterruptedMeasurementCyclesBatteryDisconnect?: number;
}

export interface BatteryDataDetails {
  /** Manufacturing date of the battery. */
  manufacturingDate?: string;
  /** Hardware version of the battery. */
  hwVersion?: string;
  /** Nominal capacity of the battery in watt-hours. */
  nominalCapacity?: number;
  /** Number of completed full charge cycles of the battery. */
  fullChargeCycles?: number; // format: float
  /** Manufacturer's part number of the battery. */
  partNumber?: string;
  /** Unique serial number of the battery. */
  serialNumber?: string;
  /** Software version of the battery management system. */
  swVersion?: string;
  /** Actual measured capacity of the battery in watt-hours. */
  measuredCapacity?: number;
  /** Indicates whether the measurement was conducted while the battery was installed on a bike. */
  onBikeMeasurement?: boolean;
}

export interface BatteryFieldDataResponse {
  batteries: BatteryFieldData[];
}

export interface BatteryFieldData {
  /** Version of the statistics component code */
  statisticComponentCodeVersion?: string;
  /** Identifier of the statistics component */
  statisticComponentIdentifier?: string;
  /** Software version of the battery management system */
  swVersion?: string;
  /** Manufacturing plant code */
  plantCode?: string;
  /** Number of charging cycles performed while mounted on bike */
  chargeCycleCountOnBike?: string;
  /** Number of charging cycles performed while removed from bike */
  chargeCycleCountOffBike?: string;
  /** Total time spent charging in minutes */
  chargeDurationTotal?: string;
  /** Date of battery manufacturing */
  manufacturingDate?: string;
  /** Total amount of charge provided by the battery */
  providedChargeTotal?: string;
  /** Current remaining capacity of the battery */
  remainingCapacity?: string;
  /** Current remaining energy in the battery */
  remainingEnergy?: string;
  /** Estimated sum of charge (Q) */
  estimatedQsum?: string;
  /** Hardware version of the battery */
  hwVersion?: string;
  /** Type of battery cells used */
  cellType?: string;
  /** Part number of the battery */
  partNumber?: string;
  /** Battery voltage at -4000mA current */
  stataIbatN4000MaVoltage?: string;
  /** Battery voltage at 0mA current */
  stataIbat0MaVoltage?: string;
  /** Battery voltage at 5000mA current */
  stataIbat5000MaVoltage?: string;
  /** Battery voltage at 10000mA current */
  stataIbat10000MaVoltage?: string;
  /** Battery voltage at 15000mA current */
  stataIbat15000MaVoltage?: string;
  /** Battery voltage at 20000mA current */
  stataIbBat20000MaVoltage?: string;
  /** Historical data of remaining capacity calculated by abacus algorithm */
  abacusRemainingCapacityHistory?: string[];
  /** Current voltage of battery cells */
  cellVoltage?: string[];
  /** Current flowing through the battery */
  batteryCurrent?: string;
  /** Internal voltage measurement of the battery */
  internalBatteryVoltage?: string;
  /** External voltage measurement of the battery */
  externalBatteryVoltage?: string;
  /** Voltage of the charger signal */
  chargerSignalVoltage?: string;
  /** Status of charge FET (Field Effect Transistor) - on/off */
  isChargeFetOn?: string;
  /** Maximum charge current recorded during battery lifetime */
  maxChargeCurrentLifeTime?: string;
  /** Maximum discharge current recorded during battery lifetime */
  maxDischargeCurrentLifeTime?: string;
  /** Total time spent discharging in minutes */
  dischargeDurationTotal?: string;
  /** Maximum cell voltage recorded during battery lifetime */
  maxCellVoltageLifeTime?: string;
  /** Minimum cell voltage recorded during battery lifetime */
  minCellVoltageLifeTime?: string;
  /** Total time the battery has been powered on */
  onDurationTimeTotal?: string;
  /** Current temperature of the FET (Field Effect Transistor) */
  fetTemperature?: string;
  /** Minimum temperature recorded for the FET */
  minFetTemperature?: string;
  /** Maximum temperature recorded for the FET */
  maxFetTemperature?: string;
  /** Duration of FET thermal protection activation */
  fetThermalProtectionDuration?: string;
  /** Current temperature of the battery pack */
  packTemperature?: string;
  /** Minimum temperature recorded for the battery pack */
  minPackTemperature?: string;
  /** Maximum temperature recorded for the battery pack */
  maxPackTemperature?: string;
  /** Duration of battery pack thermal protection activation */
  packThermalProtectionDuration?: string;
  /** Maximum temperature recorded for the integrated circuit */
  maxIcTemperature?: string;
  /** Indicator if BMS is connected to a multi-battery system */
  bmsConnectedToMultiBatSystem?: string;
  /** Odometer reading from the battery management system */
  odometerBms?: string;
  /** Speed reading from the battery management system odometer */
  odometerBmsSpeed?: string;
  /** Historical data of remaining capacity measurements */
  remainingCapacityHistory?: string[];
  /** Present state of health calculated by abacus algorithm */
  presentAbacusSoh?: string;
  /** Theta parameter for battery calculations */
  theta?: string[];
  /** Counter for abacus algorithm resets */
  abacusResetCounter?: string;
  /** C0 parameter for abacus algorithm calculations */
  c0Abacus?: string;
  /** Historical data of estimated voltage measurements */
  estimatedVoltageHistory?: string[];
}

export interface DriveUnitFieldDataResponse {
  driveUnits: DriveUnitFieldData[];
}

export interface DriveUnitFieldData {
  /** Read counter for the drive unit statistics. */
  statisticReadCounter?: string;
  /** Year of the drive unit statistics. */
  year?: string;
  /** Month of the drive unit statistics. */
  month?: string;
  /** Generation of the drive unit. */
  duGeneration?: string;
  /** Part number of the drive unit. */
  partNumber?: string;
  /** Software version of the drive unit. */
  swVersion?: string;
  /** Hardware version of the drive unit. */
  hwVersion?: string;
  /** Application ID of the drive unit. */
  applicationId?: string;
  /** Odometer reading of the drive unit. */
  odometer?: string;
  /** wheel circumference of the drive unit as set by the bike manufacturer. */
  wheelCircumferenceOem?: string;
  /** wheel circumference of the drive unit as set by the user. */
  wheelCircumferenceUser?: string;
  /** Maximum PCB temperature recorded by the drive unit. */
  maxPcbTemperature?: string;
  /** Minimum PCB temperature recorded by the drive unit. */
  minPcbTemperature?: string;
  /** Maximum motor temperature recorded by the drive unit. */
  maxMotorTemperature?: string;
  /** Minimum motor temperature recorded by the drive unit. */
  minMotorTemperature?: string;
  /** Average cadence recorded by the drive unit. */
  averageCadence?: string;
  /** Average driver torque recorded by the drive unit. */
  averageDriverTorque?: string;
  /** Maximum driver torque recorded by the drive unit. */
  maxDriverTorque?: string;
  /** Installation angle of the drive unit. */
  installationAngle?: string;
  /** Maximum positive torque offset difference recorded by the drive unit. */
  maxPositiveTorqueOffsetDifference?: string;
  /** Maximum positive torque offset difference 2 recorded by the drive unit. */
  maxPositiveTorqueOffsetDifference2?: string;
  /** Maximum negative torque offset difference recorded by the drive unit. */
  maxNegativeTorqueOffsetDifference?: string;
  /** Maximum negative torque offset difference 2 recorded by the drive unit. */
  maxNegativeTorqueOffsetDifference2?: string;
  /** Time spent in thermal derating mode by the drive unit. */
  thermalDeratingTime?: string;
  /** Time spent in emergency mode by the drive unit. */
  emergencyModeTime?: string;
  /** Total time the bike was ridden, as recorded by the drive unit. */
  totalBikeRidingTime?: string;
  /** Total energy consumption of the drive unit. */
  totalEnergyConsumptionDu?: string;
  /** Total energy consumption of the motor. */
  totalEnergyConsumptionMotor?: string;
  /** Total time the motor was on, as recorded by the drive unit. */
  totalMotorOnTime?: string;
  /** Total time the drive unit was powered on. */
  totalPowerOnTime?: string;
  /** Total duration the light was on, as recorded by the drive unit. */
  lightOnDuration?: string;
  /** Identifier for the component associated with the drive unit statistics. */
  statisticComponentIdentifier?: string;
  /** Average energy consumption recorded by the drive unit. */
  averageEnergyConsumption?: string;
  /** Average energy filter Z1 recorded by the drive unit. */
  averageEnergyFilterZ1?: string;
  /** Average energy filter Z2 recorded by the drive unit. */
  averageEnergyFilterZ2?: string;
  /** Average energy filter Z3 recorded by the drive unit. */
  averageEnergyFilterZ3?: string;
  /** Average energy filter Z4 recorded by the drive unit. */
  averageEnergyFilterZ4?: string;
  /** Distance traveled in off mode, as recorded by the drive unit. */
  distanceInOffMode?: string;
  /** Energy consumed in off mode, as recorded by the drive unit. */
  energyInOffMode?: string;
  /** Distance traveled in eco mode, as recorded by the drive unit. */
  distanceInEcoMode?: string;
  /** Energy consumed in eco mode, as recorded by the drive unit. */
  energyInEcoMode?: string;
  /** Distance traveled in tour mode, as recorded by the drive unit. */
  distanceInTourMode?: string;
  /** Energy consumed in tour mode, as recorded by the drive unit. */
  energyInTourMode?: string;
  /** Distance traveled in sport mode, as recorded by the drive unit. */
  distanceInSportMode?: string;
  /** Energy consumed in sport mode, as recorded by the drive unit. */
  energyInSportMode?: string;
  /** Distance traveled in turbo mode, as recorded by the drive unit. */
  distanceInTurboMode?: string;
  /** Energy consumed in turbo mode, as recorded by the drive unit. */
  energyInTurboMode?: string;
  /** Distance traveled in user mode 1, as recorded by the drive unit. */
  distanceInUserMode1?: string;
  /** Energy consumed in user mode 1, as recorded by the drive unit. */
  energyInUserMode1?: string;
  /** Distance traveled in user mode 2, as recorded by the drive unit. */
  distanceInUserMode2?: string;
  /** Energy consumed in user mode 2, as recorded by the drive unit. */
  energyInUserMode2?: string;
  /** Distance traveled in user mode 3, as recorded by the drive unit. */
  distanceInUserMode3?: string;
  /** Energy consumed in user mode 3, as recorded by the drive unit. */
  energyInUserMode3?: string;
  /** Distance traveled in user mode 4, as recorded by the drive unit. */
  distanceInUserMode4?: string;
  /** Energy consumed in user mode 4, as recorded by the drive unit. */
  energyInUserMode4?: string;
  /** Number of back pedal strokes recorded by the drive unit. */
  numberOfBackPedalStrokes?: string;
  /** Matrix containing driver data, such as torque and cadence. Array of arrays of strings. */
  driverMatrix?: string[][];
  /** Matrix containing motor data, such as torque and cadence. Array of arrays of strings. */
  motorMatrix?: string[][];
}

@Injectable({
  providedIn: 'root',
})
export class DiagnosisFieldDataService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Get all available battery measurement field data collected by Bosch Capacity Tester (eBike System 2)
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getAllBatteryMeasurementFieldData(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<CapacityTesterFieldDataResponse> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params = params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params = params.set('serialNumber', serialNumber);
    }

    return this.http.get<CapacityTesterFieldDataResponse>(
      `${environment.eBikeApiUrl}/diagnosis-field-data/ebike-system-2/v1/capacity-testers`,
      { params: params },
    );
  }

  /**
   * Get all available battery field data collected by the battery (eBike System 2)
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getAllBatteryFieldData(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<BatteryFieldDataResponse> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params = params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params = params.set('serialNumber', serialNumber);
    }

    return this.http.get<BatteryFieldDataResponse>(
      `${environment.eBikeApiUrl}/diagnosis-field-data/ebike-system-2/v1/batteries`,
      { params: params },
    );
  }

  /**
   * Get all available drive unit field data (eBike System 2)
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getAllDriveUnitFieldData(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<DriveUnitFieldDataResponse> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params = params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params = params.set('serialNumber', serialNumber);
    }

    return this.http.get<DriveUnitFieldDataResponse>(
      `${environment.eBikeApiUrl}/diagnosis-field-data/ebike-system-2/v1/drive-units`,
      { params: params },
    );
  }
}
