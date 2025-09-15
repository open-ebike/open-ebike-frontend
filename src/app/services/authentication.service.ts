import { inject, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

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
  /** OAuth service */
  private oauthService = inject(OAuthService);

  /**
   * Logs in the user
   */
  login() {
    this.oauthService.initLoginFlow();
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
