import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { getBrowserLang, TranslocoModule } from '@jsverse/transloco';

/**
 * Represents dialog data
 */
export interface RegistrationDialogData {
  selectedEbikeGeneration: 'BES3' | 'BES2' | 'COBI';
}

/**
 * Displays registration dialog
 */
@Component({
  selector: 'app-registration-dialog',
  imports: [TranslocoModule, MatDialogContent, MatDialogTitle],
  templateUrl: './registration-dialog.component.html',
  styleUrl: './registration-dialog.component.scss',
})
export class RegistrationDialogComponent {
  //
  // Injections
  //

  /** Data */
  data = inject<RegistrationDialogData>(MAT_DIALOG_DATA);

  //
  // Constants
  //

  /** Language */
  lang = getBrowserLang();
}
