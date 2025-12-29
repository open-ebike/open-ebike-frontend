import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatListItem, MatNavList } from '@angular/material/list';
import { WebShareService } from '../../services/web-share.service';
import { SharePictureService } from '../../services/share-picture.service';

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
  /** Share picture service */
  private sharePictureService = inject(SharePictureService);
  /** Web share service */
  private webShareService = inject(WebShareService);

  //
  // Signals
  //

  /** Source image */
  imageRef = viewChild<ElementRef<HTMLImageElement>>('sourceImage');
  /** Canvas */
  canvasSharePicture = viewChild<ElementRef<HTMLCanvasElement>>('sharePicture');
  /** Canvas */
  canvasPreview = viewChild<ElementRef<HTMLCanvasElement>>('preview');

  /** Language */
  lang = getBrowserLang();

  //
  // Actions
  //

  /**
   * Handles click on share option
   */
  async onShareClicked() {
    const canvas = this.canvasSharePicture()!!.nativeElement;

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

  /**
   * Handles image being loaded
   */
  onImageLoad() {
    this.sharePictureService.updateCanvas(
      this.canvasPreview,
      this.imageRef,
      384,
      384,
      this.data.title,
    );
    this.sharePictureService.updateCanvas(
      this.canvasSharePicture,
      this.imageRef,
      996,
      996,
      this.data.title,
    );
  }
}
