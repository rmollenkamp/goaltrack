import { Shot } from "./shot.model";

export interface Game {
    teamName: string,
    opponentName: string,
    startDate: string,
    shots: Shot[],
    goals: Shot[],
    gameId?: number,
}