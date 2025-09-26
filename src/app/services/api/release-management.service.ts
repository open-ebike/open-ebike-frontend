import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface InstallationReports {
  installationReports: InstallationReport[];
  pagination: Pagination;
  links: Links;
}

export interface InstallationReport {
  status: string;
  brandId: string;
  bikeId: string;
  updateSetId: string;
  releaseSetLastModified: string;
  createdAt: string;
  clientStatus: ClientStatus;
  updateMetrics: UpdateMetrics;
  updateContext: UpdateContext;
}

export interface ClientStatus {
  statusType: string;
}

export interface UpdateMetrics {
  clientMetrics: ClientMetrics;
}

export interface ClientMetrics {
  transferStartedAt: string;
  transferFinishedAt: string;
  installationStartedAt: string;
  reportFinalizedAt: string;
}

export interface UpdateContext {
  isforcedUpdate: boolean;
  updateType: string;
  bulkConfigChangeId: string;
  clientAgent: ClientAgent;
  bikeProfileBeforeUpdate: BikeProfile;
  bikeProfileAfterUpdate: BikeProfile;
  stateOfChargeBeforeTransfer: StateOfCharge;
  stateOfChargeBeforeInstallation: StateOfCharge;
  temperatureBeforeTransfer: Temperature;
  temperatureBeforeInstallation: Temperature;
}

export interface ClientAgent {
  clientType: string;
}

export interface BikeProfile {
  applications: Applications;
  components: Component[];
  thirdPartyComponents: ThirdPartyComponent[];
}

export interface Applications {
  gearshift: Application;
  product: Application;
  speedRegion: Application;
  assistModes: Application[];
}

export interface Application {
  id: string;
  version: string;
}

export interface Component {
  bootloaderVersion: string;
  hardwareSoftwareVersion: string;
  hardwareVersion: string;
  partNumber: string;
  productCode: string;
  serialNumber: string;
  softwareVersion: string;
}

export interface ThirdPartyComponent {
  componentName: string;
  manufacturerName: string;
  serialNumber: string;
  hardwareVersion: string;
  softwareVersion: string;
}

export interface StateOfCharge {
  remoteControl: number;
  connectModule: number;
}

export interface Temperature {
  remoteControlBattery: number;
  remoteControlPcb: number;
  batteryPack1Fet: number;
  batteryPack1: number;
  batteryPack2Fet: number;
  batteryPack2: number;
  driveUnitPcb: number;
}

export interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

export interface Links {
  self: string;
  first: string;
  prev: string;
  next: string;
  last: string;
}

/**
 * Handles installation reports
 */
@Injectable({
  providedIn: 'root',
})
export class ReleaseManagementService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Get installation reports of a specified bike
   * @param bikeId bike ID
   * @param createdAfter created after
   * @param createdBefore created before
   * @param limit limit
   * @param offset offset
   */
  getInstallationReports(
    bikeId: string,
    createdAfter?: string,
    createdBefore?: string,
    limit?: number,
    offset?: number,
  ) {
    let params = new HttpParams().set('bikeId', bikeId);

    if (createdAfter) {
      params = params.set('createdAfter', createdAfter);
    }
    if (createdBefore) {
      params = params.set('createdBefore', createdBefore);
    }
    if (limit) {
      params = params.set('limit', limit);
    }
    if (offset) {
      params = params.set('offset', offset);
    }

    return this.http.get<InstallationReports>(
      `${environment.eBikeApiUrl}/software-update/smart-system/v1/installation-reports`,
      { params: params },
    );
  }
}
