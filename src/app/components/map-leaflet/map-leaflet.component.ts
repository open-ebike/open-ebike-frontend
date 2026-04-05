import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  model,
  OnDestroy,
  output,
  signal,
  ViewChild,
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
export class MapLeafletComponent implements AfterViewInit, OnDestroy {
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
  /** Hovered coordinate */
  hoveredCoordinate = model<Coordinate | undefined>(undefined);

  coordinateStart = input<Coordinate | undefined>(undefined);
  coordinateEnd = input<Coordinate | undefined>(undefined);

  /** Output signal indicating map being loaded */
  mapLoadedEmitter = output<boolean>();

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private resizeObserver!: ResizeObserver;

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
  /** Highlight marker */
  private highlightMarker?: L.CircleMarker = L.circleMarker([0, 0], {
    radius: 6,
    fillColor: '#d75b98',
    color: '#d75b98',
    weight: 2,
    fillOpacity: 1,
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
          const latLngs = this.coordinates().map(
            (coordinate) =>
              [coordinate.latitude, coordinate.longitude] as L.LatLngExpression,
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

            // Detect on-hover events
            polyline.on('mousemove', (e: L.LeafletMouseEvent) => {
              const mouseLatLng = e.latlng;
              let closestCoordinate = undefined;
              let minDistance = Infinity;

              // Find the point in your array closest to the mouse position
              this.coordinates().forEach((coordinate) => {
                const dist = mouseLatLng.distanceTo([
                  coordinate.latitude,
                  coordinate.longitude,
                ]);
                if (dist < minDistance) {
                  minDistance = dist;
                  closestCoordinate = coordinate;
                }
              });

              // Only emit if the mouse is within a reasonable distance (e.g., 20 meters)
              if (minDistance < 50) {
                this.hoveredCoordinate.set(closestCoordinate);
              } else {
                this.hoveredCoordinate.set(undefined);
              }
            });
          }
        }, 500);
      }
    });

    // Handles hovered coordinate
    effect(() => {
      if (this.isLoaded()) {
        const hovered = this.hoveredCoordinate();
        if (hovered) {
          const latLng: L.LatLngExpression = [
            hovered.latitude,
            hovered.longitude,
          ];
          this.highlightMarker?.setLatLng(latLng).addTo(this.map);
        } else {
          this.highlightMarker?.remove();
        }
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

    this.resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        this.map.invalidateSize({
          animate: true,
        });
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
