import { createFeature, createReducer, on } from '@ngrx/store';
import { GamesState } from '../../models/games-state.model';
import * as GamesStateActions from '../actions/games-state.actions';

const initialState: GamesState = {
  games: [],
  currentGame: null
};

export const gamesStateFeature = createFeature({
  name: 'gamesState',
  reducer: createReducer(
    initialState,
    on(GamesStateActions.addGame, (state, action) => ({
      ...state,
      games: [
        ...state.games,
        {
          ...action.game,
          gameId: state.games.length + 1
        }
      ],
    })),
    on(GamesStateActions.changeSelectedGame, (state, action) => ({
      ...state,
      currentGame: action.game
    })),
    on(GamesStateActions.updateGame, (state, action) => ({
      ...state,
      games: state.games.map((game) => {
        if(game.gameId === action.game.gameId){
          return action.game;
        }

        return game;
      })
    }))
  )
});