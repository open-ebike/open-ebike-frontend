import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { AuthInterceptor } from './services/auth/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, TranslocoRootModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideAnimations(),
    provideOAuthClient(),
  ],
};
