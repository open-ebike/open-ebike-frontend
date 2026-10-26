import { inject, Injectable, signal } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { EbikeGeneration } from './auth/ebike-generation.type';

/**
 * Represents identify claims of an ID token
 */
export interface IdentityClaims {
  /** Expiration time */
  exp?: string | number;
  /** Issued at time */
  iat?: string | number;
  /** Authentication time */
  auth_time?: string | number;
  /** JWT ID */
  jti?: string;
  /** Issuer */
  iss?: string;
  /** Audience */
  aud?: string | string[];
  /** Subject */
  sub?: string;
  /** Type */
  typ?: string;
  azp?: string;
  /** Nonce */
  nonce?: string;
  sid?: string;
  at_hash?: string;
  acr?: string;
  /** Whether the email is verified */
  email_verified?: boolean | string;
  /** Preferred username */
  preferred_username?: string;

  //
  // BES 3
  //

  /** E-mail */
  email?: string;
  //
  // BES 2
  //

  /** eBike Connect ID */
  ebike_connect_id?: string;
  /** Name */
  name?: string;
  /** Given name */
  given_name?: string;
  /** Family name */
  family_name?: string;
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
  public ebikeGeneration = signal<EbikeGeneration | null>(null);
  /** Whether the user is logged in */
  public loggedIn = signal(false);

  /**
   * Constructor
   */
  constructor() {
    this.oauthService.events.subscribe((_) => {
      this.loggedIn.set(this.isLoggedIn());
    });
  }

  /**
   * Restores client ID from local storage
   */
  async restoreConfig() {
    const clientId = localStorage.getItem('openEbikeClientId');
    const ebikeGeneration = localStorage.getItem('openEbikeEbikeGeneration');

    if (!clientId) return false;

    this.clientId.set(clientId);
    this.ebikeGeneration.set(ebikeGeneration as EbikeGeneration);

    await this.configure(clientId, ebikeGeneration as EbikeGeneration);
    return true;
  }

  /**
   * Process login callback
   */
  async processLoginCallback() {
    await this.oauthService.tryLoginCodeFlow();
  }

  /**
   * Saves the client ID provided by the user
   * @param clientId client ID
   */
  saveClientId(clientId: string) {
    this.clientId.set(clientId);
    localStorage.setItem('openEbikeClientId', clientId);
  }

  /**
   * Saves the eBike generation
   * @param ebikeGeneration eBike generation
   */
  saveEbikeGeneration(ebikeGeneration: EbikeGeneration) {
    this.ebikeGeneration.set(ebikeGeneration);
    localStorage.setItem('openEbikeEbikeGeneration', ebikeGeneration);
  }

  /**
   * Configures the OAuth service
   * @param clientId client ID
   * @param ebikeGeneration eBike generation
   */
  async configure(
    clientId: string,
    ebikeGeneration: EbikeGeneration,
  ): Promise<void> {
    // Set client ID auth config
    const authConfig = { ...environment.authConfig } as AuthConfig;
    authConfig.clientId = clientId;

    if (ebikeGeneration == 'BES2') {
      authConfig.logoutUrl =
        'https://www.ebike-connect.com/ebikeconnect/connect/logout';
    }

    // Configure auth config
    this.oauthService.configure(authConfig);

    // Fetch token endpoint
    await this.oauthService.loadDiscoveryDocument();
  }

  /**
   * Logs in the user
   * @param ebikeGeneration eBike generation
   */
  login(ebikeGeneration: EbikeGeneration) {
    // Add IdP hint if needed
    switch (ebikeGeneration) {
      case 'BES3': {
        this.oauthService.customQueryParams = {};
        break;
      }
      case 'BES2': {
        this.oauthService.customQueryParams = {
          kc_idp_hint: 'ebike-connect',
        };
        break;
      }
      case 'COBI': {
        this.oauthService.customQueryParams = {};
        break;
      }
    }
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
  getIdentityClaims(): IdentityClaims | null {
    const claims = this.oauthService.getIdentityClaims() as IdentityClaims;
    if (claims && Object.keys(claims).length > 0) {
      return claims;
    }

    const accessToken = this.oauthService.getAccessToken();
    if (accessToken) {
      const decodedClaims = this.parseJwt(accessToken);
      if (decodedClaims) {
        return decodedClaims as IdentityClaims;
      }
    }

    return null;
  }

  /**
   * Decodes a JWT token safely
   * @param token JWT token
   */
  private parseJwt(token: string): Record<string, any> | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        return null;
      }
      let base64Url = parts[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
