import { Component, effect, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { YearlyAchievementGridComponent } from '../../../components/yearly-achievement-grid/yearly-achievement-grid.component';
import { Bes2YearlyAchievementService } from '../../../services/yearly-achievement/bes2/bes2-yearly-achievement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { YearlyAchievementCarouselComponent } from '../../../components/yearly-achievement-carousel/yearly-achievement-carousel.component';

/**
 * Displays yearly achievements
 */
@Component({
  selector: 'app-yearly-achievements',
  imports: [
    TranslocoDirective,
    YearlyAchievementGridComponent,
    YearlyAchievementCarouselComponent,
  ],
  templateUrl: './bes2-yearly-achievements.component.html',
  styleUrl: './bes2-yearly-achievements.component.scss',
  standalone: true,
})
export class Bes2YearlyAchievementsComponent {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Yearly achievement service */
  public yearlyAchievementService = inject(Bes2YearlyAchievementService);
  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  //
  // Selections
  //

  /** Selected year */
  yearSelected = signal<number | undefined>(undefined);

  /** Language */
  lang = getBrowserLang();

  /**
   * Constructor
   */
  constructor() {
    this.route.params.subscribe((params) => {
      const year = params['year'];
      this.yearSelected.set(isNaN(year) ? undefined : +year);
    });

    effect(() => {
      this.router.navigate([
        `/bes3/yearly-achievements/${this.yearSelected() ?? ''}`,
      ]);
    });
  }
}
