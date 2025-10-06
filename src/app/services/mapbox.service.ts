import { Injectable, signal } from '@angular/core';
import { ActivityDetail } from './api/activity-records.service';

interface GeojsonFeatureCollection {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: { [key: string]: any };
    geometry: {
      type: 'LineString';
      coordinates: number[][];
    };
  }>;
}

/**
 * Handles interaction with Mapbox
 */
@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  /** Mapbox access token */
  public mapboxAccessToken = signal<string>('');

  /**
   * Restores client ID from local storage
   */
  async restoreConfig() {
    const mapboxAccessToken = localStorage.getItem('mapboxAccessToken');

    if (!mapboxAccessToken) return false;

    this.mapboxAccessToken.set(mapboxAccessToken);
    return true;
  }

  /**
   * Builds a line-string geojson based on a given list of activity details
   * @param activityDetails activity details
   */
  public buildGeojson(
    activityDetails: ActivityDetail[],
  ): GeojsonFeatureCollection {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            'bounding-box': this.buildBoundingBox(activityDetails, 0.000001),
          },
          geometry: {
            type: 'LineString',
            coordinates: activityDetails
              .filter((detail) => {
                return detail.latitude != 0 && detail.longitude;
              })
              .map((detail) => [
                detail.longitude,
                detail.latitude,
                detail.altitude,
              ]),
          },
        },
      ],
    };
  }

  /**
   * Builds the bounding box for a given list of activity details
   * @param activityDetails activity details
   * @param padding padding
   */
  buildBoundingBox(
    activityDetails: ActivityDetail[],
    padding?: number,
  ): number[] {
    if (padding == undefined) padding = 0;

    // Initialize bounding box values
    let minLat = Infinity;
    let minLon = Infinity;
    let maxLat = -Infinity;
    let maxLon = -Infinity;

    // Map the input data to GeoJSON coordinates (longitude, latitude, altitude)
    activityDetails
      .filter((detail) => {
        return detail.latitude != 0 && detail.longitude;
      })
      .forEach((detail) => {
        // Update bounding box on each point
        minLat = Math.min(minLat, detail.latitude) - padding;
        minLon = Math.min(minLon, detail.longitude) - padding;
        maxLat = Math.max(maxLat, detail.latitude) + padding;
        maxLon = Math.max(maxLon, detail.longitude) + padding;

        // GeoJSON specification requires longitude before latitude
        return [detail.longitude, detail.latitude, detail.altitude];
      });

    return [minLon, minLat, maxLon, maxLat];
  }
}
