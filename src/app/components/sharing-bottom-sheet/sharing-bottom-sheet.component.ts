import { Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatListItem, MatNavList } from '@angular/material/list';
import { WebShareService } from '../../services/web-share.service';

/**
 * Represents data
 */
export interface SharingBottomSheetData {
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Description */
  imageUrl: string;
}

@Component({
  selector: 'app-sharing-bottom-sheet',
  imports: [TranslocoDirective, MatNavList, MatListItem],
  templateUrl: './sharing-bottom-sheet.component.html',
  styleUrl: './sharing-bottom-sheet.component.scss',
  standalone: true,
})
export class SharingBottomSheetComponent {
  //
  // Injections
  //

  /** Data */
  public data = inject<SharingBottomSheetData>(MAT_BOTTOM_SHEET_DATA);
  /** Web share service */
  private webShareService = inject(WebShareService);

  /** Language */
  lang = getBrowserLang();

  //
  // Actions
  //

  /**
   * Handles click on share option
   */
  onShareClicked() {
    this.webShareService.share(
      this.data.title,
      this.data.description,
      this.data.imageUrl,
    );
  }
}
