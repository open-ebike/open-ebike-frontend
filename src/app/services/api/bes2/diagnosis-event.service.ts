import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

@Injectable({
  providedIn: 'root',
})
export class DiagnosisEventService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Gets the tuning reset events of eBike System 2 drive units
   * @param partNumber part number
   * @param serialNumber serial number
   */
  getAllTuningResetEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<TuningResets> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params.set('serialNumber', serialNumber);
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
  getAllBatteryDeactivationEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<BatteryDeactivations> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params.set('serialNumber', serialNumber);
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
  getAllLockResetEvents(
    partNumber?: string,
    serialNumber?: string,
  ): Observable<LockResets> {
    let params = new HttpParams();
    if (partNumber != undefined) {
      params.set('partNumber', partNumber);
    }
    if (serialNumber != undefined) {
      params.set('serialNumber', serialNumber);
    }

    return this.http.get<LockResets>(
      `${environment.eBikeApiUrl}/diagnosis-event/ebike-system-2/v1/battery-deactivations`,
      { params: params },
    );
  }
}
