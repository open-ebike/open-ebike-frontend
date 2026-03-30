import { Component, inject } from '@angular/core';
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
import { ConsentService } from '../../services/consent.service';

/**
 * Displays cookie banner
 */
@Component({
  selector: 'app-consent-bottom-sheet',
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
  templateUrl: './consent-bottom-sheet.component.html',
  styleUrl: './consent-bottom-sheet.component.scss',
  standalone: true,
})
export class ConsentBottomSheetComponent {
  //
  // Injections
  //

  /** Consent service */
  public consentService = inject(ConsentService);
  /** Bottom sheet reference */
  private bottomSheetRef = inject(
    MatBottomSheetRef<ConsentBottomSheetComponent>,
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
   * Handles click on accept-only-essentials button
   */
  onAcceptOnlyEssentialsClicked() {
    this.consentService.consentMapbox.set(false);
    this.consentService.consentMapillary.set(false);

    this.consentService.consentChoiceMade.set(true);
    this.bottomSheetRef.dismiss();
  }

  /**
   * Handles click on accept-selected button
   */
  onAcceptOnlySelectedClicked() {
    this.consentService.consentChoiceMade.set(true);
    this.bottomSheetRef.dismiss();
  }

  /**
   * Handles click on accept-all button
   */
  onAcceptAllClicked() {
    this.consentService.consentMapbox.set(true);
    this.consentService.consentMapillary.set(true);

    this.consentService.consentChoiceMade.set(true);
    this.bottomSheetRef.dismiss();
  }
}
