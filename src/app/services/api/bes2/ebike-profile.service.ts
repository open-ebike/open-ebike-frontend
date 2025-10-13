import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

/**
 * Handles eBike profiles
 */
@Injectable({
  providedIn: 'root',
})
export class EbikeProfileService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Retrieves details for bikes
   * @partNumber drive unit part number
   * @serialNumber drive unit serial number
   */
  getAllBikes(
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
}
