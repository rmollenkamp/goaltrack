import { createSelector } from '@ngrx/store';
import { gamesStateFeature } from '../features/games.features';

export const selectGames = createSelector(
    gamesStateFeature.selectGames,
    (games) => games
);

export const  selectCurrentGame = createSelector(
    gamesStateFeature.selectCurrentGame,
    (currentGame) => currentGame
)