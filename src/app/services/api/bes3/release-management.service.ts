import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Dexie, { liveQuery, Table } from 'dexie';
import { firstValueFrom, from, Observable } from 'rxjs';

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

//
// Cache
//

/**
 * Represents a database item
 */
interface DatabaseItem {
  /** ID */
  id: string;
  /** Installation reports */
  installationReports: InstallationReports;
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
    super('bes3-release-management-database');
    this.version(1).stores({
      items: 'id',
      syncState: 'id',
    });
  }
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

  //
  // Access
  //

  /**
   * Get installation reports of a specified bike
   * @param bikeId bike ID
   */
  getInstallationReports(
    bikeId: string,
  ): Observable<InstallationReports | undefined> {
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
   * Get installation reports of a specified bike
   * @param bikeId bike ID
   * @param createdAfter created after
   * @param createdBefore created before
   * @param limit limit
   * @param offset offset
   */
  private fetchInstallationReports(
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
