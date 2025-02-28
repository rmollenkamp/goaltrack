import { createFeature, createReducer, on } from '@ngrx/store';

import * as AppStateActions from '../actions/app-state.actions'
import { AppState } from '../../models/app-state.model';

const initialState: AppState = {
  menuVisible: false,
};

export const appStateFeature = createFeature({
  name: 'appState',
  reducer: createReducer(
    initialState,
    on(AppStateActions.toggleMenu, (state) => ({
      ...state,
      menuVisible: !state.menuVisible,
    }))
  )
});