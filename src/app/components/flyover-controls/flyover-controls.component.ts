import { Component, effect, inject, input, model, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatIconButton } from '@angular/material/button';
import { interval, map, scan, takeWhile } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

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
  // Injections
  //

  /** Theme service */
  public themeService = inject(ThemeService);

  //
  // Signals
  //

  /** Number of steps */
  steps = input(100);
  /** Period in seconds */
  period = input(100);

  /** Whether control is playing */
  playing = signal(false);
  /** Progress */
  progress = model(0);

  /**
   * Constructor
   */
  constructor() {
    // Handles play to be completed
    effect(() => {
      if (this.progress() >= 100) {
        this.playing.set(false);
      }
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on play button
   */
  onPlayClicked() {
    this.play();
  }

  /**
   * Handles click on re-play button
   */
  onReplayClicked() {
    this.progress.set(0);
    this.play();
  }

  //
  // Helpers
  //

  /**
   * Plays the control
   */
  private play() {
    this.playing.set(true);

    interval((this.period() * 1_000) / this.steps())
      .pipe(
        map(() => 100 / this.steps()),
        scan((acc, curr) => acc + curr, this.progress()),
        takeWhile(() => {
          return this.playing();
        }),
        map((value) => Math.min(value, 100)),
      )
      .subscribe((value) => {
        this.progress.set(value);
      });
  }
}
