import { Injectable, signal } from '@angular/core';

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
}
