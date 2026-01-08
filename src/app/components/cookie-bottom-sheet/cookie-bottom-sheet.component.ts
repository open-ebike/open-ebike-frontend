import { Component, effect, inject, signal } from '@angular/core';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

/**
 * Displays cookie banner
 */
@Component({
  selector: 'app-cookie-bottom-sheet',
  imports: [
    TranslocoDirective,
    MatListItem,
    MatButton,
    MatList,
    MatSlideToggle,
    MatListItemTitle,
    MatListItemLine,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    FormsModule,
    MatCardAvatar,
    MatCardHeader,
    MatCardContent,
  ],
  templateUrl: './cookie-bottom-sheet.component.html',
  styleUrl: './cookie-bottom-sheet.component.scss',
  standalone: true,
})
export class CookieBottomSheetComponent {
  //
  // Injections
  //

  /** Bottom sheet reference */
  private bottomSheetRef = inject(
    MatBottomSheetRef<CookieBottomSheetComponent>,
  );

  //
  // Signals
  //

  /** Consent for caching data */
  consentCachingData = signal<boolean>(
    localStorage.getItem('openEbikeConsentCachingData') === 'true',
  );
  /** Consent for caching client ID */
  consentCachingClientId = signal<boolean>(
    localStorage.getItem('openEbikeConsentCachingClientId') === 'true',
  );
  /** Consent for Mapbox */
  consentMapbox = signal<boolean>(
    localStorage.getItem('openEbikeConsentMapbox') === 'true',
  );
  /** Consent for Mapillary */
  consentMapillary = signal<boolean>(
    localStorage.getItem('openEbikeConsentMapillary') === 'true',
  );

  /** Language */
  lang = getBrowserLang();

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      localStorage.setItem(
        'openEbikeConsentMapbox',
        this.consentMapbox().toString(),
      );
      localStorage.setItem(
        'openEbikeConsentMapillary',
        this.consentMapillary().toString(),
      );
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on accept-only-essentials button
   */
  onAcceptOnlyEssentialsClicked() {
    localStorage.setItem('privacySettingsSelected', 'true');
    this.consentMapbox.set(false);
    this.consentMapillary.set(false);
    this.bottomSheetRef.dismiss();
  }

  /**
   * Handles click on accept-selected button
   */
  onAcceptOnlySelectedClicked() {
    localStorage.setItem('privacySettingsSelected', 'true');
    this.bottomSheetRef.dismiss();
  }

  /**
   * Handles click on accept-all button
   */
  onAcceptAllClicked() {
    localStorage.setItem('privacySettingsSelected', 'true');
    this.consentMapbox.set(true);
    this.consentMapillary.set(true);
    this.bottomSheetRef.dismiss();
  }
}
