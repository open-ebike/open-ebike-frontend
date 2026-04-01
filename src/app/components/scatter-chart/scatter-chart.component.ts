import {
  Component,
  effect,
  ElementRef,
  HostListener,
  input,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import {
  Chart,
  ChartData,
  ChartOptions,
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

  id = signal('scatter-chart');
  /** Height of the map */
  height = input('500px');
  /** Coordinates */
  coordinates = input<Coordinate[]>([]);
  /** Hovered coordinate */
  hoveredCoordinate = model<Coordinate | undefined>(undefined);
  /** Attributes to be rendered */
  attributes = input<string[]>([]);

  colors = ['#3c5297', '#5261ac', '#4e9dce', '#8bd2fb'];

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
      if (this.id()) {
        setTimeout(() => {
          this.initializeChart(this.id());
        }, 500);
      }
    });

    // Handles update
    effect(() => {
      if (this.id() && this.coordinates().length > 0 && this.attributes()) {
        setTimeout(() => {
          this.updateChart(this.id(), this.coordinates(), this.attributes());
        }, 500);
      }
    });

    // Handles hovered coordinate
    effect(() => {
      const hovered = this.hoveredCoordinate();
      const chart = this.chart || Chart.getChart(this.id());
      if (chart) {
        (chart as any).hoveredIndex = hovered?.index;
        chart.update('none');
      }
    });
  }

  //
  // Initialization
  //

  /**
   * Initializes chart
   * @param id ID
   */
  private initializeChart(id: string) {
    let chart = Chart.getChart(id);

    // Initialize chart
    if (!chart) {
      const verticalLinePlugin = {
        id: 'verticalLine',
        afterDraw: (chart: any) => {
          // We check for a timestamp attached to the chart instance
          if (chart.hoveredIndex !== undefined) {
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

      chart = new Chart(id, {
        type: 'scatter',
        data: {
          labels: [],
          datasets: [],
        },
        plugins: [verticalLinePlugin],
        options: {},
      });
    }
    this.chart = chart as any;
  }

  /**
   * Updates chart
   * @param id ID
   * @param coordinates coordinates
   * @param attributes attributes
   */
  private updateChart(
    id: string,
    coordinates: Coordinate[],
    attributes: string[],
  ) {
    let chart = Chart.getChart(id);

    if (!chart) return;

    const chartData: ChartData = {
      datasets: attributes.map((attribute, index) => {
        return {
          label: attribute,
          data: coordinates.map((coordinate) => ({
            x: coordinate.index,
            // @ts-ignore
            y: coordinate[attribute],
          })),
          showLine: true,
          borderColor: this.colors[index],
          backgroundColor: this.colors[index],
          pointRadius: 1,
          tension: 0.1,
          yAxisID: attribute,
        };
      }),
    };

    const scales: any = {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: true,
        },
      },
    };
    attributes.forEach((attribute) => {
      scales[attribute] = {
        type: 'linear',
        position: 'left',
        title: { display: true, text: attribute.toString() },
        stack: 'stack',
        stackWeight: 1,
      };
    });

    const chartOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: scales,
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
      plugins: {
        legend: {
          onClick: (_) => {},
        },
      },
    };

    // Update chart data and options
    chart.data = chartData;
    chart.options = chartOptions;

    try {
      chart.update();
    } catch (_) {}
  }

  //
  // Actions
  //

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    const chart = this.chart || Chart.getChart(this.id());
    if (chart) {
      chart.resize();
    }
  }
}
