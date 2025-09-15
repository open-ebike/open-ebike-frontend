import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, TranslocoRootModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideOAuthClient(),
    {
      provide: 'AUTH_CONFIG',
      useValue: environment.authConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          oauthService.configure(environment.authConfig);
          oauthService.setupAutomaticSilentRefresh();
          return oauthService.loadDiscoveryDocumentAndTryLogin();
        };
      },
      deps: [OAuthService],
      multi: true,
    },
  ],
};
