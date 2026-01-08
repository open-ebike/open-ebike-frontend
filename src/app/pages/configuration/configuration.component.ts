import { Component, inject, OnInit } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MapboxService } from '../../services/mapbox.service';
import { MapillaryService } from '../../services/mapillary.service';
import { combineLatest, first } from 'rxjs';
import { Theme, ThemeService } from '../../services/theme.service';
import { ActivatedRoute } from '@angular/router';

/**
 * Displays configuration component
 */
@Component({
  selector: 'app-configuration',
  imports: [
    TranslocoDirective,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    FormsModule,
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  standalone: true,
})
export class ConfigurationComponent implements OnInit {
  //
  // Injections
  //

  /** Activated route */
  private route = inject(ActivatedRoute);
  /** Theme service */
  public themeService = inject(ThemeService);
  /** Mapbox service */
  public mapboxService = inject(MapboxService);
  /** Mapillary service */
  public mapillaryService = inject(MapillaryService);

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
   * Handles on-init lifecycle phase
   */
  async ngOnInit() {
    await this.mapboxService.restoreConfig();
    await this.mapillaryService.restoreConfig();
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
   * Handles click on save button
   * @param mapboxAccessToken Mapbox access token
   */
  onSaveMapboxClicked(mapboxAccessToken: string) {
    localStorage.setItem('openEbikeMapboxAccessToken', mapboxAccessToken);
  }

  /**
   * Handles click on save button
   * @param mapillaryAccessToken Mapillary access token
   */
  onSaveMapillaryClicked(mapillaryAccessToken: string) {
    localStorage.setItem('openEbikeMapillaryAccessToken', mapillaryAccessToken);
  }
}
