import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface InstallationReports {
  installationReports: InstallationReport[];
  pagination: InstallationReportPagination;
  links: InstallationReportLinks;
}

export interface InstallationReport {
  /** Timestamp when the report was created */
  createdAt: string; // format: date-time
  /** The id of the software package used for the installation */
  updateSetId: string;
  /** Result of the update installation */
  status: InstallationStatus;
  /** The identifier of the bike composed of serial number and part number of the eBike System 2 Drive Unit */
  bikeIdentifier: BikeIdentifier;
  bikeProfileBeforeUpdate: BikeProfile;
  bikeProfileAfterUpdate?: BikeProfile;
}

export type InstallationStatus =
  | 'INSTALLATION_UNKNOWN'
  | 'INSTALLATION_SUCCESSFUL'
  | 'INSTALLATION_ERROR_GENERAL'
  | 'INSTALLATION_ERROR_NETWORK'
  | 'INSTALLATION_ERROR_PRECONDITIONS'
  | 'INSTALLATION_BDU_FAILED'
  | 'INSTALLATION_BUI_FAILED'
  | 'INSTALLATION_BAS_FAILED'
  | 'INSTALLATION_BBP1_FAILED'
  | 'INSTALLATION_BBP2_FAILED';

export interface BikeIdentifier {
  driveUnitSerialNumber: EbikeSystem2SerialNumber;
  driveUnitPartNumber: EbikeSystem2PartNumber;
}

export type EbikeSystem2SerialNumber = string;

export type EbikeSystem2PartNumber = string;

export interface BikeProfile {
  /** A list of components installed on the bike */
  components: BikeComponent[];
  /** Identifier of the Applications/configurations installed on the bik */
  application?: string;
}

export interface BikeComponent {
  /** The product code of the component */
  productCode: string;
  /** The installed software version of the component */
  softwareVersion: string;
  /** The hardware version of the component */
  hardwareVersion: string;
  /** The product line of the component */
  productLine?: string;
  serialNumber?: EbikeSystem2SerialNumber;
  partNumber?: EbikeSystem2PartNumber;
}

/**
 * Interface for the pagination object in the installation reports response
 */
export interface InstallationReportPagination {
  limit: number;
  offset: number;
  total: number;
}

/**
 * Interface for the links object in the installation reports response
 */
export interface InstallationReportLinks {
  self: string;
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReleaseManagementService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Get installation reports of a specified bike
   * @param partNumber part number
   * @param serialNumber serial number
   * @param createdAfter created after
   * @param createdBefore created before
   * @param limit limit
   * @param offset offset
   */
  getInstallationReports(
    partNumber: string,
    serialNumber: string,
    createdAfter?: string,
    createdBefore?: string,
    limit?: number,
    offset?: number,
  ): Observable<InstallationReports> {
    let params = new HttpParams();
    params = params.set('partNumber', partNumber);
    params = params.set('serialNumber', serialNumber);

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
      `${environment.eBikeApiUrl}/software-update/ebike-system-2/v1/installation-reports`,
      { params: params },
    );
  }
}
