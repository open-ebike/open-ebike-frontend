import {
  AfterViewInit,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import * as L from 'leaflet';
import { NgStyle } from '@angular/common';

/**
 * Represents a coordinate
 */
export interface Coordinate {
  /** Index */
  index: number;
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;
}

/**
 * Displays a leaflet map
 */
@Component({
  selector: 'app-map-leaflet',
  imports: [NgStyle],
  templateUrl: './map-leaflet.component.html',
  styleUrl: './map-leaflet.component.scss',
  standalone: true,
})
export class MapLeafletComponent implements AfterViewInit {
  //
  // Signals
  //

  /** Signal indicating if map is loaded */
  isLoaded = signal(false);

  /** Unique ID for this map */
  id = input('map');
  /** Height of the map */
  height = input('500px');

  /** Coordinates */
  coordinates = input<Coordinate[]>([]);

  coordinateStart = input<Coordinate | undefined>(undefined);
  coordinateEnd = input<Coordinate | undefined>(undefined);

  /** Output signal indicating map being loaded */
  mapLoadedEmitter = output<boolean>();

  //
  // Map
  //

  /** Map */
  private map!: L.Map;
  /** Start marker */
  private startMarker = L.circleMarker([0, 0], {
    radius: 8,
    fillColor: '#ffffff',
    color: '#5261ac',
    weight: 2,
    fillOpacity: 1,
    pane: 'fixed-markers',
  });
  /** End marker */
  private endMarker = L.circleMarker([0, 0], {
    radius: 8,
    fillColor: '#5261ac',
    color: '#5261ac',
    weight: 2,
    fillOpacity: 1,
    pane: 'fixed-markers',
  });

  /**
   * Constructor
   */
  constructor() {
    // Handles map initialization
    effect(() => {
      if (this.isLoaded()) {
        this.mapLoadedEmitter.emit(true);
      }
    });

    // Handles coordinates
    effect(() => {
      if (this.isLoaded() && this.coordinates()) {
        setTimeout(() => {
          const latLngs = this.coordinates()
            .filter(
              (coordinate) =>
                coordinate.latitude != 0.0 || coordinate.longitude != 0.0,
            )
            .map(
              (coordinate) =>
                [
                  coordinate.latitude,
                  coordinate.longitude,
                ] as L.LatLngExpression,
            );

          if (latLngs.length > 2) {
            // Display coordinates on map
            const polyline = L.polyline(latLngs, { color: '#5261ac' }).addTo(
              this.map,
            );
            this.map.fitBounds(polyline.getBounds());

            // Add start marker
            if (this.coordinateStart()) {
              this.startMarker
                .setLatLng([
                  this.coordinateStart()?.latitude ?? 0,
                  this.coordinateStart()?.longitude ?? 0,
                ])
                .addTo(this.map);
            }

            // Add end marker
            if (this.coordinateEnd()) {
              this.endMarker
                .setLatLng([
                  this.coordinateEnd()?.latitude ?? 0,
                  this.coordinateEnd()?.longitude ?? 0,
                ])
                .addTo(this.map);
              // L.marker([lastPoint.latitude, lastPoint.longitude])
              //   .addTo(this.map);
            }
          }
        }, 500);
      }
    });
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit(): void {
    this.initMap();
  }

  //
  // Initialization
  //

  /**
   * Initializes map
   */
  private initMap(): void {
    this.map = L.map('map', {
      center: [52.52, 13.4],
      zoom: 13,
    });

    const topPane = this.map.createPane('fixed-markers');
    topPane.style.zIndex = '650';
    topPane.style.pointerEvents = 'none';

    // Add OpenStreetMap tiles
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );

    tiles.addTo(this.map);
    this.isLoaded.set(true);
  }
}
