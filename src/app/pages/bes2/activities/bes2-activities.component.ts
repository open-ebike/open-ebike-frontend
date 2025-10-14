import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MetersToKilometersPipe } from '../../../pipes/meters-to-kilometers.pipe';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
} from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MapComponent } from '../../../components/map/map.component';
import { MatPaginator } from '@angular/material/paginator';
import { RoundPipe } from '../../../pipes/round.pipe';
import { ActivatedRoute } from '@angular/router';
import { Theme, ThemeService } from '../../../services/theme.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { combineLatest, first } from 'rxjs';
import {
  ActivityService,
  ActivitySummary,
} from '../../../services/api/bes2/activity.service';

/**
 * Displays activities
 */
@Component({
  selector: 'app-activities',
  imports: [
    TranslocoDirective,
    MatList,
    MatListItem,
    MatIcon,
    DatePipe,
    MatRipple,
    MetersToKilometersPipe,
    MatCard,
    MatCardContent,
    MatSidenavModule,
    MatButton,
    MapComponent,
    MatCardActions,
    MatCardFooter,
    MatPaginator,
    RoundPipe,
  ],
  templateUrl: './bes2-activities.component.html',
  styleUrl: './bes2-activities.component.scss',
  standalone: true,
})
export class Bes2ActivitiesComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Theme service */
  private themeService = inject(ThemeService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);
  /** Activity service */
  private activityService = inject(ActivityService);

  //
  // Signals
  //

  /** Signal providing the selected activity ID */
  id = signal<string>('');
  /** Signal providing activity summaries */
  activitySummaries = signal<ActivitySummary[]>([]);

  //
  // Paginator
  //

  pageTotalLength = signal(0);
  pageIndex = signal(0);
  pageSize = signal(20);
  pageOffset = computed(() => this.pageIndex() * this.pageSize());

  pageSizeOptions = [1, 20, 50, 100];

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
      this.initializeActivitiesSummaries(this.pageSize(), this.pageOffset());
    });
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init phase
   */
  ngOnInit() {
    this.handleQueryParameters();
  }

  //
  // Initialization
  //

  /**
   * Initializes activities
   */
  private initializeActivitiesSummaries(limit: number, offset: number) {
    this.activityService
      .getAllActivitySummaries(limit, offset)
      .subscribe((activitySummaries) => {
        this.activitySummaries.set(activitySummaries.activities);
        this.pageTotalLength.set(activitySummaries.pagination.total);
      });
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

  //
  // Actions
  //

  /**
   * Handles page event
   * @param event event
   */
  handlePageEvent(event: any) {
    if (event.pageSize !== this.pageSize()) {
      this.pageSize.set(event.pageSize);
      this.pageIndex.set(0);
    } else {
      this.pageIndex.set(event.pageIndex);
    }
  }
}
