import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MapillaryImage {
  id: string;
  thumb_1024_url?: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
}

/**
 * Represents the response body
 */
export interface MapillaryResponse {
  data: MapillaryImage[];
}

@Injectable({
  providedIn: 'root',
})
export class MapillaryService {
  //
  // Injections
  //

  /** HTTP client */
  private http = inject(HttpClient);

  /** Mapillary access token */
  public mapillaryAccessToken = signal<string>('');

  /**
   * Restores access token from local storage
   */
  async restoreConfig() {
    const mapillaryAccessToken = localStorage.getItem('mapillaryAccessToken');

    if (!mapillaryAccessToken) return false;

    this.mapillaryAccessToken.set(mapillaryAccessToken);
    return true;
  }

  /**
   * Finds the closest street-view image to a specific coordinate.
   * @param lat latitude
   * @param lon longitude
   * @param searchRadiusDegrees roughly 0.001 deg is ~100 meters
   */
  getImageByLocation(
    lat: number,
    lon: number,
    searchRadiusDegrees: number = 0.001,
  ): Observable<MapillaryResponse> {
    const bbox = [
      lon - searchRadiusDegrees,
      lat - searchRadiusDegrees,
      lon + searchRadiusDegrees,
      lat + searchRadiusDegrees,
    ].join(',');

    const params = new HttpParams()
      .set('access_token', this.mapillaryAccessToken())
      .set('bbox', bbox)
      .set('fields', 'id,thumb_1024_url,geometry')
      .set('limit', '1');

    return this.http.get<MapillaryResponse>(
      'https://graph.mapillary.com/images',
      { params },
    );
  }
}
