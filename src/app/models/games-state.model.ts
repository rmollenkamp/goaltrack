import { Game } from "./game.model";

export interface GamesState {
    games: Game[],
    currentGame: Game | null
}