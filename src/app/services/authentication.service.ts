import { inject, Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

/**
 * Represents identify claims of an ID token
 */
export interface IdentityClaims {
  /** Expiration time */
  exp: string;
  /** Issued at time */
  iat: string;
  /** Authentication time */
  auth_time: string;
  /** JWT ID */
  jti: string;
  /** Issuer */
  iss: string;
  /** Audience */
  aud: string;
  /** Subject */
  sub: string;
  /** Type */
  typ: string;
  azp: string;
  /** Nonce */
  nonce: string;
  sid: string;
  at_hash: string;
  acr: string;
  /** Whether the email is verified */
  email_verified: string;
  /** Preferred username */
  preferred_username: string;
  /** E-mail */
  email: string;
}

/**
 * Handles user authentication
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  /** Router */
  private router = inject(Router);
  /** OAuth service */
  private oauthService = inject(OAuthService);
  /** Signal providing client ID */
  public clientId = signal<string>('');

  /**
   * Restores client ID from local storage
   */
  async restoreConfig() {
    const clientId = localStorage.getItem('clientId');

    if (!clientId) return false;

    await this.configure(clientId);
    return true;
  }

  /**
   * Process login callback
   */
  async processLoginCallback() {
    await this.oauthService.tryLoginCodeFlow();
  }

  /**
   * Configures the OAuth service
   * @param clientId client ID
   */
  async configure(clientId: string): Promise<void> {
    this.clientId.set(clientId);

    // Set client ID auth config
    const authConfig = { ...environment.authConfig };
    authConfig.clientId = clientId;

    // Configure auth config
    this.oauthService.configure(authConfig);

    // Fetch token endpoint
    await this.oauthService.loadDiscoveryDocument();

    // Store client ID
    localStorage.setItem('clientId', clientId);
  }

  /**
   * Logs in the user
   */
  login() {
    this.oauthService.initCodeFlow();
  }

  /**
   * Logs out the user
   */
  logout() {
    this.oauthService.logOut();
  }

  /**
   * Checks if the user is logged in
   */
  isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  /**
   * Retrieves the user's identity claims
   */
  getIdentityClaims(): IdentityClaims {
    return this.oauthService.getIdentityClaims() as IdentityClaims;
  }
}
