import { Injectable, signal } from '@angular/core';
import { ActivityDetail as Bes3ActivityDetail } from './api/bes3/activity-records.service';
import {
  ActivityDetail as Bes2ActivityDetail,
  Coordinate,
} from './api/bes2/activity.service';

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

/** Represents a bounding box */
export type BoundingBox = [number, number, number, number];

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

  //
  // BES3
  //

  /**
   * Builds a line-string geojson based on a given list of activity details
   * @param activityDetails activity details
   */
  public buildBes3Geojson(
    activityDetails: Bes3ActivityDetail[],
  ): GeojsonFeatureCollection {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            'bounding-box': this.buildBes3BoundingBox(
              activityDetails,
              0.000001,
            ),
          },
          geometry: {
            type: 'LineString',
            coordinates: activityDetails
              .filter((detail) => {
                return detail.latitude != 0 && detail.longitude != 0;
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
  buildBes3BoundingBox(
    activityDetails: Bes3ActivityDetail[],
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

  //
  // BES2
  //

  /**
   * Builds a line-string geojson based on a given list of activity details
   * @param activityDetails activity details
   */
  public buildBes2Geojson(
    activityDetails: Bes2ActivityDetail,
  ): GeojsonFeatureCollection {
    return {
      type: 'FeatureCollection',
      features:
        activityDetails?.coordinates?.map((outer) => {
          return {
            type: 'Feature',
            properties: {
              'bounding-box': this.buildBes2BoundingBox(outer, 0.000001),
            },
            geometry: {
              type: 'LineString',
              coordinates:
                outer
                  ?.filter((inner) => {
                    return (
                      inner != null &&
                      inner?.latitude != 0 &&
                      inner?.longitude != 0
                    );
                  })
                  ?.map((inner) => [
                    inner?.longitude ?? 0,
                    inner?.latitude ?? 0,
                  ]) ?? [],
            },
          };
        }) ?? [],
    };
  }

  /**
   * Builds the bounding box for a given list of activity details
   * @param outer array of coordinates
   * @param padding padding
   */
  buildBes2BoundingBox(
    outer: (Coordinate | null)[],
    padding?: number,
  ): number[] {
    if (padding == undefined) padding = 0;

    // Initialize bounding box values
    let minLat = Infinity;
    let minLon = Infinity;
    let maxLat = -Infinity;
    let maxLon = -Infinity;

    // Map the input data to GeoJSON coordinates (longitude, latitude, altitude)
    outer
      ?.filter((detail) => {
        return detail?.latitude != 0 && detail?.longitude != 0;
      })
      .forEach((detail) => {
        // Update bounding box on each point
        minLat = Math.min(minLat, detail?.latitude ?? Infinity) - padding;
        minLon = Math.min(minLon, detail?.longitude ?? Infinity) - padding;
        maxLat = Math.max(maxLat, detail?.latitude ?? -Infinity) + padding;
        maxLon = Math.max(maxLon, detail?.longitude ?? -Infinity) + padding;

        // GeoJSON specification requires longitude before latitude
        return [detail?.longitude, detail?.latitude];
      });

    return [minLon, minLat, maxLon, maxLat];
  }

  /**
   * Add a padding to a given bounding box
   * @param boundingBox bounding box
   * @param paddingHorizontal horizontal padding
   * @param padddingVertical vertical padding
   */
  buildBoundingBoxWithPadding(
    boundingBox: BoundingBox,
    paddingHorizontal: number,
    padddingVertical: number,
  ): BoundingBox {
    return [
      boundingBox[0] - paddingHorizontal,
      boundingBox[1] - padddingVertical,
      boundingBox[2] + paddingHorizontal,
      boundingBox[3] + padddingVertical,
    ] as BoundingBox;
  }
}
