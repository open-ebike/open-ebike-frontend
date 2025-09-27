import { Injectable } from '@angular/core';

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
  /**
   * Logs in the user
   */
  login() {}

  /**
   * Logs out the user
   */
  logout() {}

  /**
   * Checks if the user is logged in
   */
  isLoggedIn() {
    return true;
  }

  /**
   * Retrieves the user's identity claims
   */
  getIdentityClaims(): IdentityClaims {
    return {
      exp: '',
      iat: '',
      auth_time: '',
      jti: '',
      iss: '',
      aud: '',
      sub: '',
      typ: '',
      azp: '',
      nonce: '',
      sid: '',
      at_hash: '',
      acr: '',
      email_verified: '',
      preferred_username: '',
      email: 'mock@local.com',
    };
  }
}
