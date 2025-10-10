import { inject, Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { EbikeGeneration } from './auth/ebike-generation.type';

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

  //
  // BES 3
  //

  /** E-mail */
  email: string;
  //
  // BES 2
  //

  /** eBike Connect ID */
  ebike_connect_id: string;
  /** Name */
  name: string;
  /** Given name */
  given_name: string;
  /** Family name */
  family_name: string;
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
  /** Signal providing client ID */
  public clientId = signal<string>('');
  /** Signal providing eBike generation */
  public ebikeGeneration = signal<EbikeGeneration | null>('BES2');

  /**
   * Restores client ID from local storage
   */
  async restoreConfig() {}

  /**
   * Process login callback
   */
  async processLoginCallback() {}

  /**
   * Saves the client ID provided by the user
   * @param clientId client ID
   */
  saveClientId(clientId: string) {
    this.clientId.set(clientId);
    localStorage.setItem('clientId', clientId);
  }

  /**
   * Saves the eBike generation
   * @param ebikeGeneration eBike generation
   */
  saveEbikeGeneration(ebikeGeneration: EbikeGeneration) {
    this.ebikeGeneration.set(ebikeGeneration);
    localStorage.setItem('ebikeGeneration', ebikeGeneration);
  }

  /**
   * Configures the OAuth service
   * @param clientId client ID
   * @param ebikeGeneration eBike generation
   */
  async configure(
    clientId: string,
    ebikeGeneration: EbikeGeneration,
  ): Promise<void> {}

  /**
   * Logs in the user
   * @param ebikeGeneration eBike generation
   */
  login(ebikeGeneration: EbikeGeneration) {}

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
      ebike_connect_id: '',
      name: 'Mock Local',
      given_name: 'Mock',
      family_name: 'Local',
    };
  }
}
