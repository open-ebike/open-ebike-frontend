import { inject, Injectable } from '@angular/core';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

/**
 * Handles regions
 */
@Injectable({
  providedIn: 'root',
})
export class RegionFinderService {
  /** http client */
  private http = inject(HttpClient);

  /** Federal states geodata */
  private geodataFederalStates: FeatureCollection | null = null;

  /**
   * Constructor
   */
  constructor() {
    this.loadStatesData();
  }

  //
  // Initialization
  //

  /**
   * Loads data for federal states
   */
  async loadStatesData() {
    this.geodataFederalStates = await firstValueFrom(
      this.http.get<FeatureCollection>(
        '/assets/data/germany-geodata/federal-states.geojson',
      ),
    );
  }

  //
  // Helpers
  //

  /**
   * Retrieves federal state based on given coordinates
   * @param latitude latitude
   * @param longitude longitude
   */
  getFederalState(latitude: number, longitude: number): string | null {
    const targetPoint = point([longitude, latitude]);

    for (const feature of this.geodataFederalStates?.features ?? []) {
      if (
        feature.geometry.type === 'Polygon' ||
        feature.geometry.type === 'MultiPolygon'
      ) {
        const geometry = feature.geometry as Polygon | MultiPolygon;

        if (booleanPointInPolygon(targetPoint, geometry)) {
          return feature.properties?.['name'];
        }
      }
    }

    return null;
  }
}
