import { Component, inject, OnInit } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MapboxService } from '../../services/mapbox.service';

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

  /** Mapbox service */
  public mapboxService = inject(MapboxService);

  /** Language */
  lang = getBrowserLang();

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  async ngOnInit() {
    await this.mapboxService.restoreConfig();
  }

  //
  // Actions
  //

  /**
   * Handles click on save button
   * @param mapboxAccessToken Mapbox access token
   */
  onSaveClicked(mapboxAccessToken: string) {
    localStorage.setItem('mapboxAccessToken', mapboxAccessToken);
  }
}
