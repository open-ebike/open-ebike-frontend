import { Component, inject, OnInit } from '@angular/core';
import { combineLatest, first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { getBrowserLang, TranslocoModule } from '@jsverse/transloco';
import { Theme, ThemeService } from '../../services/theme.service';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Displays a contact
 */
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [TranslocoModule, MatIcon],
  standalone: true,
})
export class ContactComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Router */
  private router = inject(Router);
  /** Theme service */
  private themeService = inject(ThemeService);

  /** Icon registry */
  private iconRegistry = inject(MatIconRegistry);
  /** Sanitizer */
  private sanitizer = inject(DomSanitizer);

  /** Language */
  lang = getBrowserLang();

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
    this.initializeTheme();
    this.initializeIcons();

    // Handle query parameters
    this.handleQueryParameters();
  }

  //
  // Initialization
  //

  /**
   * Initializes theme
   */
  private initializeTheme() {
    switch (this.themeService.theme()) {
      case Theme.LIGHT: {
        this.updateQueryParameters();
        break;
      }
      case Theme.DARK: {
        this.updateQueryParameters();
        break;
      }
    }
  }

  /**
   * Initializes icons
   */
  private initializeIcons() {
    this.iconRegistry.addSvgIcon(
      'github',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/github_24dp.svg',
      ),
    );
    this.iconRegistry.addSvgIcon(
      'linkedin',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/linkedin_24dp.svg',
      ),
    );
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
  // Helpers
  //

  /**
   * Updates query parameters
   */
  private updateQueryParameters() {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {
          [this.QUERY_PARAM_THEME]: this.themeService.theme(),
        },
      })
      .then();
  }
}
