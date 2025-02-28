import { createFeature, createReducer, on } from '@ngrx/store';
import { GamesState } from '../../models/games-state.model';
import * as GamesStateActions from '../actions/games-state.actions';

const initialState: GamesState = {
  games: [],
};

export const gamesStateFeature = createFeature({
  name: 'gamesState',
  reducer: createReducer(
    initialState,
    on(GamesStateActions.addGame, (state, action) => ({
      ...state,
      games: [
        ...state.games,
        action.game
      ],
    }))
  )
});