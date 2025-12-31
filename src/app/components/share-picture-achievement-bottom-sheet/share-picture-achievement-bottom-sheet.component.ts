import { Component, ElementRef, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatListItem, MatNavList } from '@angular/material/list';
import { WebShareService } from '../../services/web-share.service';
import { SharePictureAchievementComponent } from '../share-picture-achievement/share-picture-achievement.component';

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
  selector: 'app-share-picture-achievement-bottom-sheet',
  imports: [
    TranslocoDirective,
    MatNavList,
    MatListItem,
    SharePictureAchievementComponent,
  ],
  templateUrl: './share-picture-achievement-bottom-sheet.component.html',
  styleUrl: './share-picture-achievement-bottom-sheet.component.scss',
  standalone: true,
})
export class SharePictureAchievementBottomSheetComponent {
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
