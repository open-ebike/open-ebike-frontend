import { Component, ElementRef, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatListItem, MatNavList } from '@angular/material/list';
import { WebShareService } from '../../services/web-share.service';
import { SharePictureComponent } from '../share-picture/share-picture.component';

/**
 * Represents data
 */
export interface SharingBottomSheetData {
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Image URL */
  imageUrl: string;
}

/**
 * Displays sharing bottom sheet
 */
@Component({
  selector: 'app-sharing-bottom-sheet',
  imports: [TranslocoDirective, MatNavList, MatListItem, SharePictureComponent],
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

  /** Canvas */
  canvasSharePicture: ElementRef<HTMLCanvasElement> | undefined;
  /** Language */
  lang = getBrowserLang();

  //
  // Actions
  //

  /**
   * Handles loading of share picture
   * @param canvas canvas
   */
  onSharePictureLoaded(canvas: ElementRef<HTMLCanvasElement> | undefined) {
    this.canvasSharePicture = canvas;
  }

  /**
   * Handles click on share option
   */
  async onShareClicked() {
    const canvas = this.canvasSharePicture!!.nativeElement;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png', 1.0),
    );
    const file = new File([blob!!], 'shared-image.png', { type: 'image/png' });

    this.webShareService.shareFile(
      this.data.title,
      this.data.description,
      file,
    );
  }
}
