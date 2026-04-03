import { Component, input, model, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatIconButton } from '@angular/material/button';
import { interval, map, scan, takeWhile } from 'rxjs';

/**
 * Displays fly-over controls
 */
@Component({
  selector: 'app-flyover-controls',
  imports: [
    FormsModule,
    MatProgressBarModule,
    MatSlider,
    MatSliderThumb,
    MatIconButton,
  ],
  templateUrl: './flyover-controls.component.html',
  styleUrl: './flyover-controls.component.scss',
  standalone: true,
})
export class FlyoverControlsComponent {
  //
  // Signals
  //

  /** Number of steps */
  steps = input(100);
  /** Update interval in seconds */
  interval = input(0.25);

  /** Whether control is playing */
  playing = signal(false);
  /** Progress */
  progress = model(0);

  //
  // Actions
  //

  /**
   * Handles click on play button
   */
  onPlayClicked() {
    this.playing.set(true);

    interval(this.interval() * 1_000)
      .pipe(
        map(() => 100 / this.steps()),
        scan((acc, curr) => acc + curr, this.progress()),
        takeWhile((value) => {
          return this.playing() && value <= 100;
        }),
      )
      .subscribe((value) => {
        this.progress.set(value);
      });
  }

  /**
   * Handles click on stop button
   */
  onPauseCLicked() {
    this.playing.set(false);
  }
}
