import { Injectable, signal } from '@angular/core';

/**
 * Enum containing available themes
 */
export enum Theme {
  LIGHT = 'theme-light',
  DARK = 'theme-dark',
}

/**
 * Handles current theme
 */
@Injectable({
  providedIn: 'root',
})
// @ts-ignore
export class ThemeService {
  /** Subject providing theme selected by user */
  theme = signal<Theme>(Theme.LIGHT);

  /**
   * Switches theme
   * @param theme new theme
   */
  switchTheme(theme: Theme) {
    this.theme.set(theme);
  }
}
