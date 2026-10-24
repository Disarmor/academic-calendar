import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localeRu from '@angular/common/locales/ru';
import { ApplicationConfig, ErrorHandler, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AppErrorHandler } from './core/errors/app-error-handler';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: LOCALE_ID, useValue: 'ru' },
    provideHttpClient(withFetch()),
    provideRouter(routes),
  ],
};
