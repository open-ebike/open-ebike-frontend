import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Hubs {
  /** The hubs of the user */
  hubs: Hub[];
}

export interface Hub {
  /** The serial number of the hub */
  serialNumber?: string;
  /** The part number of the hub */
  partNumber?: string;
  /** The role of the hub (is the user the owner or is the hub shared by another user) */
  role?: 'OWNER' | 'GUEST';
  /** The timestamp when the hub was activated */
  activatedAt?: string;
}

/**
 * Handles hubs
 */
@Injectable({
  providedIn: 'root',
})
export class HubService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Lists hubs
   */
  getHubs(): Observable<Hubs> {
    return this.http.get<Hubs>(`${environment.eBikeApiUrl}/cobi/v1/hubs`);
  }
}
