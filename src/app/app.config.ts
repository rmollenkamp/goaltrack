import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { appStateFeature } from './ngrx/features/app-state.features';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { gamesStateFeature } from './ngrx/features/games.features';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync('noop'),
    provideStore(),
    provideState(appStateFeature),
    provideState(gamesStateFeature),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
