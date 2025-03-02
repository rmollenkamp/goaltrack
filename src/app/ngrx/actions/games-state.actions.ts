import { createAction, props } from '@ngrx/store';
import { Game } from '../../models/game.model';
import { Shot } from '../../models/shot.model';

export const addGame = createAction(
  '[New Game Component] Add Game',
  props<{ game: Game }>()
);

export const changeSelectedGame = createAction(
  '[Games Component] Change Selected Game',
  props<{ game: Game }>()
)

export const updateGame = createAction(
  '[Games Component] Update Game',
  props<{ game: Game }>()
)