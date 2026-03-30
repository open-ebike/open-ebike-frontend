import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { ThemeService } from '../../services/theme.service';
import { MapboxService } from '../../services/mapbox.service';
import { MapillaryService } from '../../services/mapillary.service';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

/**
 * Displays configuration bottom sheet
 */
@Component({
  selector: 'app-configuration-bottom-sheet',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    TranslocoDirective,
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
  ],
  templateUrl: './configuration-bottom-sheet.component.html',
  styleUrl: './configuration-bottom-sheet.component.scss',
  standalone: true,
})
export class ConfigurationBottomSheetComponent {
  //
  // Injections
  //

  private bottomSheetRef = inject(
    MatBottomSheetRef<ConfigurationBottomSheetComponent>,
  );

  /** Theme service */
  public themeService = inject(ThemeService);
  /** Mapbox service */
  public mapboxService = inject(MapboxService);
  /** Mapillary service */
  public mapillaryService = inject(MapillaryService);

  //
  // Signals
  //

  public mapboxAccessToken = signal(this.mapboxService.mapboxAccessToken());
  public mapillaryAccessToken = signal(
    this.mapillaryService.mapillaryAccessToken(),
  );

  //
  // Constants
  //

  /** Language */
  lang = getBrowserLang();

  //
  // Actions
  //

  /**
   * Handles click on save button
   */
  onSaveClicked() {
    this.mapboxService.mapboxAccessToken.set(this.mapboxAccessToken());
    this.mapillaryService.mapillaryAccessToken.set(this.mapillaryAccessToken());
    this.bottomSheetRef.dismiss();
  }
}
