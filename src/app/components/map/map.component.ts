import { AfterViewInit, Component, inject, input, output } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MapboxService } from '../../services/mapbox.service';

/**
 * Map box style
 * @see https://docs.mapbox.com/api/maps/#styles
 */
export enum MapBoxStyle {
  // STREETS_V11 = 'mapbox://styles/mapbox/streets-v11',
  // OUTDOORS_V11 = 'mapbox://styles/mapbox/outdoors-v11',
  LIGHT_V10 = 'mapbox://styles/mapbox/light-v10',
  DARK_V10 = 'mapbox://styles/mapbox/dark-v10',
  // SATELLITE_V9 = 'mapbox://styles/mapbox/satellite-v9',
  // SATELLITE_STREETS_V11 = 'mapbox://styles/mapbox/satellite-streets-v11',
  // NAVIGATION_GUIDANCE_DAY_V2 = 'mapbox://styles/mapbox/navigation-guidance-day-v2',
  // NAVIGATION_GUIDANCE_NIGHT_V2 = 'mapbox://styles/mapbox/navigation-guidance-night-v2',
}

export interface Location {
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  zoom?: number;
  pitch?: number;
  bearing?: number;
}

const BRANDENBURG_GATE: Location = {
  name: 'Brandenburger Tor',
  description: '',
  longitude: 13.377777777778,
  latitude: 52.516388888889,
};

/**
 * Displays a map box
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
})
export class MapComponent implements AfterViewInit {
  //
  // Signals
  //

  /** Unique ID for this map */
  id = input('map');
  /** Height of the map */
  height = input('500px');
  /** Display name of the map */
  displayName = input('');

  /** Render style for Map */
  style = input(MapBoxStyle.LIGHT_V10);
  /** Zoom factor */
  zoom = input(10);
  /** Minimum zoom factor */
  minZoom = input(5);
  /** Maximum zoom factor */
  maxZoom = input(20);
  /** Pitch */
  pitch = input(0);
  /** Bearing */
  bearing = input(0);
  /** Initial center of map */
  center = input<Location>(BRANDENBURG_GATE);
  /** Initial bounding box of map */
  boundingBox = input<number[]>();

  /** Whether interactive mode is enabled or not */
  interactiveEnabled = input(true);

  /** Output signal indicating map being loaded */
  mapLoadedEmitter = output<boolean>();

  //
  // Injections
  //

  /** Mapbox service */
  private mapboxService = inject(MapboxService);

  /** Map Box object */
  private map: mapboxgl.Map | undefined;

  //
  // Lifecycle hooks
  //

  /**
   * Handles after-view-init phase
   */
  ngAfterViewInit() {
    this.mapboxService.restoreConfig();
    this.initializeMapBox(this.mapboxService.mapboxAccessToken());

    this.map?.on('load', () => {
      this.mapLoadedEmitter.emit(true);
    });
  }

  //
  // Helpers
  //

  /**
   * Initializes Map Box
   */
  initializeMapBox(accessToken: string | undefined) {
    mapboxgl.accessToken = accessToken;
    this.map = new mapboxgl.Map({
      container: this.id(),
      style: this.style(),
      zoom: this.zoom(),
      minZoom: this.minZoom(),
      maxZoom: this.maxZoom(),
      pitch: this.pitch(),
      bearing: this.bearing(),
      center: [this.center().longitude, this.center().latitude],
      interactive: this.interactiveEnabled(),
    });

    if (this.boundingBox() != null) {
      // @ts-ignore
      this.map.fitBounds(this.boundingBox());
    }
  }
}
