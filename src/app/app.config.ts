import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { routes } from './app.routes';
import { THY_NOTIFY_DEFAULT_CONFIG_PROVIDER } from 'ngx-tethys/notify';

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, ThyTooltipModule),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(),
        provideAnimations(),
        provideRouter(routes),
        THY_NOTIFY_DEFAULT_CONFIG_PROVIDER
    ]
};
