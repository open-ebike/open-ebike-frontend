import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface BikePasses {
  /** List of bike passes for the requested bike */
  bikePasses: BikePass[];
}

export interface BikePass {
  /** The Smart System bike's globally unique ID (RFC 4122-compliant UUID) aka. Bosch System ID */
  bikeId: string;
  /** Unique identifier for the bike's frame */
  frameNumber: string;
  /** Position of unique identifier for the bike's frame */
  frameNumberPosition: string;
  /** Description of special attributes of the bike */
  description: string;
  /** Timestamp when bikes pass has been created */
  createdAt: string;
  /** Timestamp when bike pass has been updated (latest update) */
  updatedAt: string;
}

/**
 * Handles bike passes
 */
@Injectable({
  providedIn: 'root',
})
export class BikePassService {
  /** http client */
  http = inject(HttpClient);

  /**
   * Gets bike passes for a Smart System bike
   * @param bikeId bike ID
   */
  getBikePasses(bikeId: string) {
    return this.http.get<BikePasses>(
      `${environment.eBikeApiUrl}/bike-pass/smart-system/v1/bike-passes?bikeId=${bikeId}`,
    );
  }
}
