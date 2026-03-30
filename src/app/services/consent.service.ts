import { effect, Injectable, signal } from '@angular/core';

/**
 * Handles consents
 */
@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  /** Consent choice made */
  consentChoiceMade = signal<boolean>(
    localStorage.getItem('openEbikePrivacySettingsSelected') === 'true',
  );

  /** Consent for caching data */
  consentCachingData = signal<boolean>(
    localStorage.getItem('openEbikeConsentCachingData') === 'true',
  );
  /** Consent for caching client ID */
  consentCachingClientId = signal<boolean>(
    localStorage.getItem('openEbikeConsentCachingClientId') === 'true',
  );
  /** Consent for Mapbox */
  consentMapbox = signal<boolean>(
    localStorage.getItem('openEbikeConsentMapbox') === 'true',
  );
  /** Consent for Mapillary */
  consentMapillary = signal<boolean>(
    localStorage.getItem('openEbikeConsentMapillary') === 'true',
  );

  /**
   * Constructor
   */
  constructor() {
    // Set mandatory consents
    this.consentCachingData.set(true);
    this.consentCachingClientId.set(true);

    // Handles consent choice being made once
    effect(() => {
      localStorage.setItem(
        'openEbikeConsentChoiceMade',
        this.consentChoiceMade().toString(),
      );
    });

    // Handles change in consents
    effect(() => {
      localStorage.setItem(
        'openEbikeConsentCachingData',
        this.consentCachingData().toString(),
      );
      localStorage.setItem(
        'openEbikeConsentCachingClientId',
        this.consentCachingClientId().toString(),
      );
      localStorage.setItem(
        'openEbikeConsentMapbox',
        this.consentMapbox().toString(),
      );
      localStorage.setItem(
        'openEbikeConsentMapillary',
        this.consentMapillary().toString(),
      );
    });

    // Handles revocation of consents
    effect(() => {
      if (!this.consentMapbox()) {
        this.removeLocalStorage('mapbox');
      }
      if (!this.consentMapillary()) {
        this.removeCookie('mly_cb');
      }
    });
  }

  //
  // Helpers
  //

  /**
   * Removes local storage
   * @param prefix prefix
   */
  private removeLocalStorage(prefix: string) {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => {
        localStorage.removeItem(key);
      });
  }

  /**
   * Removes a cookie
   * @param name name
   * @param path path
   */
  private removeCookie(name: string, path: string = '/') {
    document.cookie = `${name}=; Max-Age=0; path=${path}`;
  }
}
