import { Component, inject, OnInit } from '@angular/core';
import { Bes2AchievementService } from '../../../services/achievement/bes2/bes2-achievement.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { AchievementGridComponent } from '../../../components/achievement-grid/achievement-grid.component';
import { MatIconButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { combineLatest, first } from 'rxjs';
import { Theme, ThemeService } from '../../../services/theme.service';
import { ActivatedRoute } from '@angular/router';

/**
 * Displays achievements
 */
@Component({
  selector: 'app-bes2-achievements',
  imports: [
    TranslocoDirective,
    AchievementGridComponent,
    MatIcon,
    MatIconButton,
    MatProgressBar,
  ],
  templateUrl: './bes2-achievements.component.html',
  styleUrl: './bes2-achievements.component.scss',
  standalone: true,
})
export class Bes2AchievementsComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Achievement service */
  public achievementService = inject(Bes2AchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();

  protected readonly Array = Array;

  //
  // Constants
  //

  /** Query parameter theme */
  private QUERY_PARAM_THEME: string = 'theme';

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
   * Handles click on refresh button
   */
  onRefreshClicked() {
    this.achievementService.evaluate();
  }
}
