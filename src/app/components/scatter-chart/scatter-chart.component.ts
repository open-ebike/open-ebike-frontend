import {
  Component,
  effect,
  ElementRef,
  HostListener,
  input,
  model,
  ViewChild,
} from '@angular/core';
import {
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  ScatterController,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { NgStyle } from '@angular/common';

Chart.register(
  ScatterController,
  LinearScale,
  PointElement,
  LineElement,
  annotationPlugin,
);

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

  /** Altitude */
  altitude: number;
  /** Speed */
  speed: number;
  /** Cadence */
  cadence: number;
  /** Rider power */
  riderPower: number;
}

/**
 * Displays a scatter chart
 */
@Component({
  selector: 'app-scatter-chart',
  imports: [NgStyle],
  templateUrl: './scatter-chart.component.html',
  styleUrl: './scatter-chart.component.scss',
  standalone: true,
})
export class ScatterChartComponent {
  //
  // Signals
  //

  /** Height of the map */
  height = input('500px');
  /** Coordinates */
  coordinates = input<Coordinate[]>([]);
  /** Hovered coordinate */
  hoveredCoordinate = model<Coordinate | undefined>(undefined);
  /** Attribute to be rendered */
  attribute = input();

  @ViewChild('chartCanvas') canvas!: ElementRef;
  private chart!: Chart<
    'scatter',
    {
      x: number;
      y: number;
    }[],
    unknown
  >;

  /**
   * Constructor
   */
  constructor() {
    // Handles initialization
    effect(() => {
      setTimeout(() => {
        if (this.coordinates().length > 0) {
          this.initializeChart(this.coordinates());
        }
      }, 500);
    });

    // Handles hovered coordinate
    effect(() => {
      const hovered = this.hoveredCoordinate();
      if (this.chart) {
        (this.chart as any).hoveredIndex = hovered?.index;
        this.chart.update('none');
      }
    });
  }

  //
  // Initialization
  //

  /**
   * Initializes chart
   * @param coordinates coordinates
   * @private
   */
  private initializeChart(coordinates: Coordinate[]) {
    const chartData = coordinates.map((coordinate) => ({
      x: coordinate.index,
      y: coordinate.altitude,
    }));

    // Define the plugin constant
    const verticalLinePlugin = {
      id: 'verticalLine',
      afterDraw: (chart: any) => {
        // We check for a timestamp attached to the chart instance
        if (chart.hoveredIndex) {
          const {
            ctx,
            chartArea: { top, bottom },
            scales: { x: xAxis },
          } = chart;

          // Convert the timestamp (Date or number) into a pixel coordinate
          const xPixel = xAxis.getPixelForValue(chart.hoveredIndex);

          // Only draw if the pixel is within the actual chart area
          if (
            xPixel >= chart.chartArea.left &&
            xPixel <= chart.chartArea.right
          ) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#d75b98';
            ctx.setLineDash([3, 3]);
            ctx.moveTo(xPixel, top);
            ctx.lineTo(xPixel, bottom);
            ctx.stroke();
            ctx.restore();
          }
        }
      },
    };

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: this.attribute()?.toString(),
            data: chartData,
            showLine: true,
            borderColor: '#5261ac',
            backgroundColor: '#5261ac',
            pointRadius: 1,
            tension: 0.1,
          },
        ],
      },
      plugins: [verticalLinePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              display: false,
            },
            grid: {
              display: true,
            },
          },
          y: {
            title: { display: true, text: this.attribute()?.toString() },
          },
        },
        onHover: (event, elements, chart) => {
          const nearestElements = chart.getElementsAtEventForMode(
            // @ts-ignore
            event.native,
            'nearest',
            { intersect: false, axis: 'x' },
            true,
          );

          if (nearestElements.length > 0) {
            const index = nearestElements[0].index;
            const coord = this.coordinates()[index];

            // Setting this signal triggers the effect above
            if (this.hoveredCoordinate() !== coord) {
              this.hoveredCoordinate.set(coord);
            }
          }
        },
      },
    });
  }

  //
  // Actions
  //

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.chart.resize();
  }
}
