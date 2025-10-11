import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

export interface Registrations {
  registrations: Registration[];
}

export type RegistrationType = 'BIKE_REGISTRATION' | 'COMPONENT_REGISTRATION';

export interface Registration {
  /** Allowed values: BIKE_REGISTRATION COMPONENT_REGISTRATION */
  registrationType: RegistrationType;
  /** Timestamp when bike or component has been registered. Only present if the requesting user registered the bike / component */
  createdAt: string;
  bikeRegistration?: BikeRegistration;
  componentRegistration?: ComponentRegistration;
}

export interface BikeRegistration {
  /** Bosch unique eBike system ID */
  bikeId: string;
}

export interface ComponentRegistration {
  /** The part number of the component */
  partNumber: string;
  /** The serial number of the component */
  serialNumber: string;
  componentType: 'DRIVE_UNIT';
}

/**
 * Handles registrations
 */
@Injectable({
  providedIn: 'root',
})
export class EbikeRegistrationService {
  /** http client */
  http = inject(HttpClient);

  /**
   * List all bike and component registrations
   */
  getRegistrations() {
    return this.http.get<Registrations>(
      `${environment.eBikeApiUrl}/bike-registration/smart-system/v1/registrations`,
    );
  }
}
