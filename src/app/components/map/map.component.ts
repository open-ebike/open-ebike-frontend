import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { MapboxService, Marker } from '../../services/mapbox.service';
import { Coordinate } from '../map-leaflet/map-leaflet.component';

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

export interface ImageMarker {
  longitude: number;
  latitude: number;
  imageUrl: string;
  imageCreator: { id: string; username: string };
}

const BRANDENBURG_GATE: Location = {
  name: 'Brandenburger Tor',
  description: '',
  longitude: 13.377777777778,
  latitude: 52.516388888889,
};

const BOSCH_ECAMPUS: Location = {
  name: 'Brandenburger Tor',
  description: '',
  longitude: 9.1351074,
  latitude: 48.4950381,
};

/**
 * Displays a mapbox map
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  //
  // Signals
  //

  /** Signal indicating if map is loaded */
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

  /** Hovered coordinate */
  hoveredCoordinate = model<Coordinate | undefined>(undefined);

  /** Whether interactive mode is enabled or not */
  interactiveEnabled = input(true);

  /** Map of map overlays */
  overlays = input<Map<string, Overlay>>(new Map<string, Overlay>());
  /** List of markers to be displayed */
  markers = input<Marker[]>([]);
  /** List of image markers */
  imageMarkers = input<ImageMarker[]>([]);

  currentMarkers: mapboxgl.Marker[] = [];

  /** Output signal indicating map being loaded */
  mapLoadedEmitter = output<boolean>();
  /** Output signal indicated an image marker being clicked */
  onImageMarkerClickedEmitter = output<ImageMarker>();

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private resizeObserver!: ResizeObserver;

  //
  // Injections
  //

  /** Mapbox service */
  private mapboxService = inject(MapboxService);
  /** HTTP client */
  private http = inject(HttpClient);

  /** Map Box object */
  private map: mapboxgl.Map | undefined;

  /** Highlight marker for hovered coordinate */
  private highlightMarker: mapboxgl.Marker | undefined;

  /** Extracted coordinates from GeoJSON layers for hovering */
  private geoJsonCoordinates: Coordinate[] = [];

  constructor() {
    // Handles map initialization
    effect(() => {
      if (this.isLoaded()) {
        if (this.markers().length > 0) {
          setTimeout(() => {
            this.initializeMarkers(this.markers());
          }, 500);
        }

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
      if (this.isLoaded() && this.imageMarkers != undefined) {
        this.initializeImageMarkers(this.imageMarkers());
      }
    });
    effect(() => {
      if (this.isLoaded() && this.boundingBox() != undefined) {
        // @ts-ignore
        this.map?.fitBounds(this.boundingBox());
      }
    });
    effect(() => {
      if (this.isLoaded()) {
        const hovered = this.hoveredCoordinate();
        if (hovered) {
          if (!this.highlightMarker) {
            const el = document.createElement('div');
            el.style.width = '12px';
            el.style.height = '12px';
            el.style.backgroundColor = '#d75b98';
            el.style.borderRadius = '50%';

            this.highlightMarker = new mapboxgl.Marker({
              element: el,
            }).setLngLat([hovered.longitude, hovered.latitude]);
          } else {
            this.highlightMarker.setLngLat([
              hovered.longitude,
              hovered.latitude,
            ]);
          }
          if (this.map) {
            this.highlightMarker.addTo(this.map);
          }
        } else {
          if (this.highlightMarker) {
            this.highlightMarker.remove();
          }
        }
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
    this.initializeMapBox(this.mapboxService.mapboxAccessToken());

    this.map?.on('load', () => {
      this.isLoaded.set(true);
    });

    this.resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        this.map.resize();
      }
    });

    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  /**
   * Handles on-destroy phase
   */
  ngOnDestroy() {
    this.resizeObserver.disconnect();
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
      this.geoJsonCoordinates = [];
      let coordinateIndex = 0;

      const parseGeojsonForCoordinates = (geojson: any) => {
        if (
          geojson &&
          geojson.type === 'FeatureCollection' &&
          geojson.features
        ) {
          geojson.features.forEach((feature: any) => {
            if (feature.geometry?.type === 'LineString') {
              feature.geometry.coordinates.forEach((coord: number[]) => {
                this.geoJsonCoordinates.push({
                  index: coordinateIndex++,
                  longitude: coord[0],
                  latitude: coord[1],
                });
              });
            }
          });
        }
      };

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
            this.http
              .get(overlay.source.value, { responseType: 'json' })
              .subscribe((data: any) => {
                parseGeojsonForCoordinates(data);
              });
            break;
          }
          case Origin.INLINE: {
            const geojson = JSON.parse(overlay.source.value);
            parseGeojsonForCoordinates(geojson);

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
   * Initializes markers
   * @param markers markers
   */
  private initializeMarkers(markers: Marker[] = []) {
    this.currentMarkers.forEach((marker) => {
      marker.remove();
    });

    markers.forEach((marker) => {
      const m = new mapboxgl.Marker({
        color: marker.color,
      })
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(this.map!!);
      this.currentMarkers.push(m);
    });
  }

  /**
   * Initializes image markers
   * @param imageMarkers image markers
   */
  private initializeImageMarkers(imageMarkers: ImageMarker[]) {
    this.currentMarkers.forEach((marker) => {
      marker.remove();
    });

    const dimension = Math.min(window.innerWidth, window.innerHeight);

    imageMarkers.forEach((marker: ImageMarker) => {
      const el = document.createElement('div');
      el.className = 'map-marker';
      el.style.backgroundImage = `url(${marker.imageUrl})`;
      el.style.width = `${dimension * 0.05}px`;
      el.style.height = `${dimension * 0.05}px`;
      el.tabIndex = 0;

      el.addEventListener('click', () => {
        this.onImageMarkerClickedEmitter.emit(marker);
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.onImageMarkerClickedEmitter.emit(marker);
        }
      });

      const m = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(this.map!!);
      this.currentMarkers.push(m);
    });
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

      if (layer.type === 'line') {
        this.map?.on('mousemove', layer.id, (e) => {
          const mouseLngLat = e.lngLat;
          let closestCoordinate: Coordinate | undefined = undefined;
          let minDistance = Infinity;

          this.geoJsonCoordinates.forEach((coordinate) => {
            const dist = mouseLngLat.distanceTo(
              new mapboxgl.LngLat(coordinate.longitude, coordinate.latitude),
            );
            if (dist < minDistance) {
              minDistance = dist;
              closestCoordinate = coordinate;
            }
          });

          if (minDistance < 50) {
            this.hoveredCoordinate.set(closestCoordinate);
          } else {
            this.hoveredCoordinate.set(undefined);
          }
        });

        this.map?.on('mouseleave', layer.id, () => {
          this.hoveredCoordinate.set(undefined);
        });
      }
    }
  }
}
