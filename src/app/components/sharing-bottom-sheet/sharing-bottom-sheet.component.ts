import {
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
  ViewChild,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MatListItem, MatNavList } from '@angular/material/list';
import { WebShareService } from '../../services/web-share.service';
import { environment } from '../../../environments/environment';

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
  /** Web share service */
  private webShareService = inject(WebShareService);

  /** Source image */
  imageRef = viewChild<ElementRef<HTMLImageElement>>('sourceImage');
  /** Canvas */
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  /** Language */
  lang = getBrowserLang();

  //
  // Constants
  //

  /** Canvas witdh */
  private readonly CANVAS_WIDTH = 480;
  /** Canvas height */
  private readonly CANVAS_HEIGHT = 480;

  //
  // Initialization
  //

  /**
   * Updates preview
   */
  updatePreview() {
    if (!this.canvasRef) return;

    const canvas = this.canvasRef()!!.nativeElement;
    const ctx = canvas?.getContext('2d');
    const img = this.imageRef()!!.nativeElement;

    if (!ctx) return;

    // Set resolution
    canvas!!.width = this.CANVAS_WIDTH;
    canvas!!.height = this.CANVAS_HEIGHT;

    // Get Dominant Color
    const dominantColor = this.getDominantColor(img);

    // Fill Background
    ctx.fillStyle = this.getDominantColor(img);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Image
    const margin = 180;
    const availableWidth = canvas.width - margin * 2;
    const availableHeight = canvas.height * 0.6;

    // Calculate aspect ratio to fit image "contain" style
    const scale = Math.min(
      availableWidth / img.naturalWidth,
      availableHeight / img.naturalHeight,
    );
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;

    //
    // Image
    //

    // Draw shadow for the image
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 15;

    const imageX = (canvas.width - width) / 2;
    const imageY = (canvas.height - height) / 2 - 40;
    ctx.drawImage(img, imageX, imageY, width, height);

    // Reset shadow for text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    //
    // Title
    //

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Title
    ctx.font = 'bold 30px Roboto, system-ui, sans-serif';
    let lineX = canvas.width / 2;
    let lineYPos = imageY + height + 40;

    let line = '';
    const lineHeight = 32;

    // Iterate over words
    this.data.title.split(' ').forEach((word, index) => {
      // Create a test line with the next word
      const testLine = line + word + ' ';

      // Measure the test line
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      // Check if it exceeds max width and isn't the first word
      if (testWidth > canvas.width * 0.9 && index > 0) {
        ctx.fillText(line, lineX, lineYPos);
        line = `${word} `;
        lineYPos += lineHeight;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, canvas.width / 2, lineYPos);

    //
    // App title
    //

    // Subtitle
    ctx.font = '20px Roboto, system-ui, sans-serif';
    ctx.globalAlpha = 0.75;
    const subtitleX = canvas.width / 2;
    const subtitleY = canvas.height - 60;
    ctx.fillText('Open eBike', subtitleX, subtitleY);
    ctx.globalAlpha = 1.0;
  }

  //
  // Actions
  //

  /**
   * Handles click on share option
   */
  async onShareClicked() {
    const canvas = this.canvasRef()!!.nativeElement;

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
    this.updatePreview();
  }

  //
  // Helpers
  //

  /**
   * Calculates the dominant color of an image by averaging pixels
   */
  private getDominantColor(img: HTMLImageElement): string {
    // Create a tiny canvas to sample data efficiently
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '#ffffff';

    // We only need a small sample size to get the average
    canvas.width = 50;
    canvas.height = 50;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      const pixelCount = data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      return `rgb(${r}, ${g}, ${b})`;
    } catch (e) {
      console.warn('Could not extract color due to CORS or other error');
      return '#f3f4f6';
    }
  }
}
