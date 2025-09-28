import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TranslocoLoader,
  TranslocoModule,
  TranslocoMissingHandler,
  provideTransloco,
  provideTranslocoMissingHandler,
} from '@jsverse/transloco';
import { Injectable, NgModule, inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { environment } from '../environments/environment';
import { TranslocoConfig } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private platformLocation = inject(PlatformLocation);

  getTranslation(langPath: string) {
    return this.http.get<Translation>(
      `${
        window.location.origin
      }${this.platformLocation.getBaseHrefFromDOM()}assets/i18n/${langPath}.json`,
    );
  }
}

/**
 * The default TranslocoMissingHandler will return the given translation key,
 * if the translation was not found. This is not sufficient if we want use a
 * fallback translations, therefore, this special handler will return undefined
 * instead of the key such that a fallback can be added easily, e.g.:
 * {{ t('errors.' + errorKey) || t('errorTranslationMissing') }}
 */
export class TranslocoUndefMissingHandler implements TranslocoMissingHandler {
  handle(key: string, config: TranslocoConfig): void {
    if (!config.prodMode) {
      const msg = `Missing translation for '${key}', will return undefined`;
      console.warn(`%c ${msg}`, 'font-size: 12px; color: red');
    }
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        fallbackLang: 'de',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: false,
        prodMode: environment.production,
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMissingHandler(TranslocoUndefMissingHandler),
  ],
})
export class TranslocoRootModule {}
