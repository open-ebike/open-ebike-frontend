import { Component, inject, OnInit } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { AuthenticationService } from '../../services/authentication.service';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

/**
 * Displays client credentials page
 */
@Component({
  selector: 'app-login',
  imports: [
    TranslocoDirective,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent implements OnInit {
  //
  // Injections
  //

  /** Authentication service */
  public authenticationService = inject(AuthenticationService);

  /** Language */
  lang = getBrowserLang();

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  async ngOnInit() {
    await this.authenticationService.restoreConfig();
    await this.authenticationService.processLoginCallback();
  }

  //
  // Actions
  //

  /**
   * Handles click on save button
   * @param clientId client ID
   */
  onSaveClicked(clientId: string) {
    this.authenticationService.configure(clientId);
  }

  /**
   * Handles click on login button
   */
  onLoginClicked() {
    this.authenticationService.login();
  }
}
