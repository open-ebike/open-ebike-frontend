import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { WebShareService } from '../../services/web-share.service';

/**
 * Represents data
 */
export interface SharingBottomSheetData {
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Blob */
  blob: Blob;
}

/**
 * Displays sharing bottom sheet
 */
@Component({
  selector: 'app-share-fly-over-bottom-sheet',
  imports: [TranslocoDirective, MatNavList, MatListItem],
  templateUrl: './share-fly-over-bottom-sheet.component.html',
  styleUrl: './share-fly-over-bottom-sheet.component.scss',
  standalone: true,
})
export class ShareFlyOverBottomSheetComponent implements AfterViewInit {
  //
  // Injections
  //

  /** Data */
  public data = inject<SharingBottomSheetData>(MAT_BOTTOM_SHEET_DATA);
  /** Web share service */
  private webShareService = inject(WebShareService);

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  /** Language */
  lang = getBrowserLang();

  //
  // Lifecycle hooks
  //

  /**
   * Handles after-view-init phase
   */
  ngAfterViewInit() {
    if (this.data.blob) {
      const videoURL = URL.createObjectURL(this.data.blob);
      const videoElement = this.videoPlayer.nativeElement;

      if (videoElement) {
        videoElement.src = videoURL;
        videoElement.load();
        videoElement.play();
      }
    }
  }

  /**
   * Handles click on share option
   */
  async onShareClicked() {
    const blob = this.data.blob;
    const file = new File([blob!!], 'shared-video.webm', {
      type: 'video/webm',
    });

    this.webShareService.shareFile(
      this.data.title,
      this.data.description,
      file,
    );
  }
}
