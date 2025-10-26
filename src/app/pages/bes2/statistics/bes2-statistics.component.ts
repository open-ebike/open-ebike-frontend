import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  getBrowserLang,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import { MatRipple } from '@angular/material/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  ActivityService,
  Statistics,
} from '../../../services/api/bes2/activity.service';
import { combineLatest, first } from 'rxjs';
import { MetersToKilometersPipe } from '../../../pipes/meters-to-kilometers.pipe';
import { RoundPipe } from '../../../pipes/round.pipe';
import Chart from 'chart.js/auto';
import { ChartData, ChartOptions } from 'chart.js';

/**
 * Displays statistics
 */
@Component({
  selector: 'app-statistics',
  imports: [
    TranslocoDirective,
    MatRipple,
    MatCardActions,
    MatCardFooter,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MetersToKilometersPipe,
    RoundPipe,
  ],
  templateUrl: './bes2-statistics.component.html',
  styleUrl: './bes2-statistics.component.scss',
  standalone: true,
})
export class Bes2StatisticsComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Theme service */
  private themeService = inject(ThemeService);
  /** Transloco service */
  private translocoService = inject(TranslocoService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Activity service */
  private activityService = inject(ActivityService);

  //
  // Signals
  //

  /** Signal providing statistics */
  statistics = signal<Statistics | undefined>(undefined);

  //
  // Chart
  //

  /** Chart data */
  chartData: ChartData | undefined = undefined;
  /** Chart options */
  chartOptions: ChartOptions | undefined = undefined;

  /** Language */
  lang = getBrowserLang();

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this.initializeChart(this.themeService.theme(), this.statistics());
    });
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init phase
   */
  ngOnInit() {
    this.initializeStatistics();
    this.handleQueryParameters();
  }

  //
  // Initialization
  //

  /**
   * Initializes statistics
   */
  private initializeStatistics() {
    this.activityService.getStatistics().subscribe((statistics) => {
      this.statistics.set(statistics);
    });
  }

  /**
   * Initializes chart
   * @param theme theme
   * @param statistics statistics
   */
  private initializeChart(theme: Theme, statistics?: Statistics) {
    if (!statistics) return;

    let chartId = 'bar-chart';
    let chart = Chart.getChart(chartId);

    // Initialize chart
    if (!chart) {
      chart = new Chart(chartId, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [],
        },
        options: {},
      });
    }

    this.chartData = {
      labels: statistics.last30DaysDistances?.map((_, index) => {
        return index;
      }),
      datasets: [
        {
          type: 'bar',
          label: this.translocoService.translate(
            `pages.statistics.terms.distance`,
          ),
          data:
            statistics.last30DaysDistances?.map((distance) => {
              return distance != undefined ? distance / 1_000 : 0;
            }) ?? [],
          backgroundColor: statistics.last30DaysDistances?.map(() => '#d75b98'),
          hoverBackgroundColor: statistics.last30DaysDistances?.map(
            () => 'hsl(330, 61%, 80%)',
          ),
        },
      ],
    };

    this.chartOptions = {
      animation: {
        duration: 0,
      },
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: theme == Theme.DARK ? '#fefefe' : '#000000',
          },
          // @ts-ignore
          onClick: null,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.formattedValue} km`;
            },
          },
        },
      },
      scales: {
        x: {
          display: false,
          ticks: {
            color: theme == Theme.DARK ? '#fefefe' : '#000000',
          },
          grid: {
            color: theme == Theme.DARK ? '#fefefe' : '#E0E0DE',
          },
        },
        y: {
          ticks: {
            color: theme == Theme.DARK ? '#fefefe' : '#000000',
          },
          grid: {
            color: theme == Theme.DARK ? '#fefefe' : '#E0E0DE',
          },
        },
      },
    };

    // Update chart data and options
    chart.data = this.chartData;
    // @ts-ignore
    chart.options = this.chartOptions;

    try {
      chart.update();
    } catch (_) {}
  }

  /**
   * Handles query parameters
   */
  private handleQueryParameters() {
    combineLatest([this.route.queryParams])
      .pipe(first())
      .subscribe(([queryParams]) => {
        const theme = queryParams[this.QUERY_PARAM_THEME];

        this.themeService.switchTheme(theme ? theme : Theme.LIGHT);
      });
  }
}
