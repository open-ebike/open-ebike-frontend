import { inject, Injectable, signal } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
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
  getIdentityClaims(): IdentityClaims {
    return this.oauthService.getIdentityClaims() as IdentityClaims;
  }
}
