import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { SharePictureService } from '../../services/share-picture.service';

/**
 * Displays a share picture
 */
@Component({
  selector: 'app-share-picture',
  imports: [],
  templateUrl: './share-picture.component.html',
  styleUrl: './share-picture.component.scss',
  standalone: true,
})
export class SharePictureComponent {
  //
  // Injections
  //

  /** Share picture service */
  sharePictureService = inject(SharePictureService);

  //
  // Signals
  //

  /** Image path */
  imagePath = input<string>();
  /** Width */
  width = input<number>(480);
  /** Height */
  height = input<number>(480);
  /** Text */
  text = input<string>('');
  /** Canvas */
  canvasOutput = output<ElementRef<HTMLCanvasElement> | undefined>();

  /** Source image */
  sourceImage = viewChild<ElementRef<HTMLImageElement>>('sourceImage');
  /** Canvas */
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this.sharePictureService.updateCanvas(
        this.canvas,
        this.sourceImage,
        this.width(),
        this.height(),
        this.text(),
      );
      this.canvasOutput.emit(this.canvas());
    });
  }

  //
  // Actions
  //

  /**
   * Handles image being loaded
   */
  onImageLoad() {
    this.sharePictureService.updateCanvas(
      this.canvas,
      this.sourceImage,
      this.width(),
      this.height(),
      this.text(),
    );
  }
}
