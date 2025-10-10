import { Component, inject, OnInit } from '@angular/core';
import { getBrowserLang, TranslocoDirective } from '@jsverse/transloco';
import { AuthenticationService } from '../../services/authentication.service';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { EbikeGeneration } from '../../services/auth/ebike-generation.type';

/**
 * Displays login page
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
    this.authenticationService.saveClientId(clientId);
  }

  /**
   * Handles click on save-and-login button
   * @param clientId client ID
   * @param ebikeGeneration eBike generation
   */
  onSaveAndLoginClicked(clientId: string, ebikeGeneration: EbikeGeneration) {
    this.authenticationService.saveClientId(clientId);
    this.authenticationService.saveEbikeGeneration(ebikeGeneration);
    this.authenticationService.configure(clientId, ebikeGeneration).then(() => {
      this.authenticationService.login(ebikeGeneration);
    });
  }
}
