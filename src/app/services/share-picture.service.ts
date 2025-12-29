import { ElementRef, Injectable, Signal } from '@angular/core';

/**
 * Handles share pictures
 */
@Injectable({
  providedIn: 'root',
})
export class SharePictureService {
  /**
   * Updates canvas
   * @param canvasRef canvas reference
   * @param imageRef image reference
   * @param canvasWidth canvas width
   * @param canvasHeight canvas height
   * @param text text text
   */
  updateCanvas(
    canvasRef: Signal<ElementRef<HTMLCanvasElement> | undefined>,
    imageRef: Signal<ElementRef<HTMLImageElement> | undefined>,
    canvasWidth: number,
    canvasHeight: number,
    text: string,
  ) {
    if (!canvasRef()) return;

    const canvas = canvasRef()!!.nativeElement;
    const ctx = canvas?.getContext('2d');
    const img = imageRef()!!.nativeElement;

    if (!ctx) return;

    // Set resolution
    canvas!!.width = canvasWidth;
    canvas!!.height = canvasHeight;

    // Fill Background
    ctx.fillStyle = this.getDominantColor(img);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //
    // Image
    //

    // Draw Image
    const margin = canvas.width * 0.35;
    const availableWidth = canvas.width - margin * 2;
    const availableHeight = canvas.height - margin * 2;

    // Calculate aspect ratio to fit image "contain" style
    const scale = Math.min(
      availableWidth / img.naturalWidth,
      availableHeight / img.naturalHeight,
    );
    const imageWidth = img.naturalWidth * scale;
    const imageHeight = img.naturalHeight * scale;

    // Draw shadow for the image
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 15;

    const imageX = (canvas.width - imageWidth) / 2;
    const imageY = (canvas.height - imageHeight) / 2 - imageHeight * 0.75;
    ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

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
    ctx.font = `bold ${canvas.height / 16}px Roboto, system-ui, sans-serif`;
    let lineX = canvas.width / 2;
    let lineYPos = imageY + imageHeight + canvas.height / 10;

    let line = '';
    const lineHeight = canvas.height / 15;

    // Iterate over words
    text.split(' ').forEach((word, index) => {
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
    ctx.font = `${canvas.height / 24}px Roboto, system-ui, sans-serif`;
    ctx.globalAlpha = 0.75;
    const subtitleX = canvas.width / 2;
    const subtitleY = canvas.height - canvas.height / 8;
    ctx.fillText('Open eBike', subtitleX, subtitleY);
    ctx.globalAlpha = 1.0;
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
