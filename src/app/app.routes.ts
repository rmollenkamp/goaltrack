import { Routes } from '@angular/router';
import { GamesComponent } from './games/games.component';
import { HistoryComponent } from './history/history.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NewGameComponent } from './new-game/new-game.component';

export const routes: Routes = [
    { path: 'games', component: GamesComponent },
    { path: 'history', component: HistoryComponent },
    { path: 'statistics', component: StatisticsComponent }
];
