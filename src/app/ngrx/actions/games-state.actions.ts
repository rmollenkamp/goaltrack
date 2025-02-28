import { createAction, props } from '@ngrx/store';
import { Game } from '../../models/game.model';

export const addGame = createAction(
  '[New Game Component] Add Game',
  props<{ game: Game }>()
);