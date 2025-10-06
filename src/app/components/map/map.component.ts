import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
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

/**
 * Represents the origin of a source or a layer
 */
export enum Origin {
  URL,
  INLINE,
  REMOVE,
}

/**
 * Represents a source
 */
export interface Source {
  /** Origin */
  origin: Origin;
  /** Name */
  name: string;
  /** Value, may be either a URL string or a geojson string */
  value: string;
}

/**
 * Represents a layer
 */
export interface Layer {
  /** Origin */
  origin: Origin;
  /** Name */
  name: string;
  /** Value, may be either a URL string or a geojson string */
  value: string;
}

/**
 * Represents an overlay. It comprises
 * <li>a source (a geojson file describing WHICH features are rendered)
 * <li>a list of layers (json files describing HOW features are rendered)
 */
export interface Overlay {
  /** Source */
  source: Source;
  /** List of layers */
  layers: Layer[];
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

  isLoaded = signal(false);

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

  /** Map of map overlays */
  overlays = input<Map<string, Overlay>>(new Map<string, Overlay>());

  /** Output signal indicating map being loaded */
  mapLoadedEmitter = output<boolean>();

  //
  // Injections
  //

  /** Mapbox service */
  private mapboxService = inject(MapboxService);
  /** HTTP client */
  private http = inject(HttpClient);

  /** Map Box object */
  private map: mapboxgl.Map | undefined;

  constructor() {
    effect(() => {
      if (this.isLoaded()) {
        this.mapLoadedEmitter.emit(true);
      }
    });
    effect(() => {
      if (this.isLoaded() && this.style() != undefined) {
        this.map?.setStyle(this.style());
      }
    });
    effect(() => {
      if (this.isLoaded() && this.overlays != undefined) {
        this.initializeOverlays(this.overlays());
      }
    });
    effect(() => {
      if (this.isLoaded() && this.boundingBox() != undefined) {
        // @ts-ignore
        this.map?.fitBounds(this.boundingBox());
      }
    });
  }

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
      this.isLoaded.set(true);
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

  /**
   * Initializes overlays
   * @param overlays overlays
   */
  private initializeOverlays(overlays: Map<string, Overlay>) {
    if (this.map != null) {
      overlays.forEach((overlay: Overlay, name: string) => {
        // Remove existing layers
        this.map?.getStyle()?.layers.forEach((layer) => {
          if ('source' in layer && layer.source === overlay.source.name) {
            if (this.map?.getLayer(layer.id)) {
              this.map?.removeLayer(layer.id);
            }
          }
        });

        // Remove existing source
        if (this.map?.getSource(overlay.source.name)) {
          this.map?.removeSource(overlay.source.name);
        }

        // Add new source
        switch (overlay.source.origin) {
          case Origin.URL: {
            this.map?.addSource(overlay.source.name, {
              type: 'geojson',
              data: overlay.source.value,
            });
            break;
          }
          case Origin.INLINE: {
            const geojson = JSON.parse(overlay.source.value);

            this.map?.addSource(overlay.source.name, {
              type: 'geojson',
              data: geojson.hasOwnProperty('data') ? geojson['data'] : geojson,
            });
            break;
          }
        }

        // Add new layers
        overlay.layers.forEach((layer: any) => {
          switch (layer.origin) {
            case Origin.URL: {
              this.http
                .get(layer.value, { responseType: 'text' as 'json' })
                .subscribe((data: any) => {
                  this.initializeLayer(overlay.source.name, layer.name, data);
                });
              break;
            }
            case Origin.INLINE: {
              this.initializeLayer(
                overlay.source.name,
                layer.name,
                layer.value,
              );
              break;
            }
          }
        });
      });
    }
  }

  /**
   * Initializes a layer
   * @param sourceName source name
   * @param layerName layer name
   * @param data json data
   */
  private initializeLayer(sourceName: string, layerName: string, data: any) {
    // Link layer to source
    const layer = JSON.parse(data);
    layer['id'] = layerName;
    layer['source'] = sourceName;

    // Remove layer
    if (this.map?.getLayer(layer['id'])) {
      this.map?.removeLayer(layer['id']);
    }

    // Add layer
    if (this.map?.getSource(sourceName)) {
      this.map?.addLayer(layer);
    }
  }
}
