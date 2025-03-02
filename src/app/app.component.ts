import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { Store } from '@ngrx/store';
import { addGame } from './ngrx/actions/games-state.actions';
import { Game } from './models/game.model';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    const date: Date = new Date();
    const game1: Game =  {
      teamName: 'Test Team 1',
      opponentName: 'Test Team 2',
      startDate: date.toLocaleDateString(),
      goals: [],
      shots: []
    };
    const game2: Game = {
      teamName: 'Test Team 3',
      opponentName: 'Test Team 4',
      startDate: date.toLocaleDateString(),
      shots: [],
      goals: [],
    };
    const game3: Game = {
      teamName: 'Test Team 5',
      opponentName: 'Test Team 6',
      startDate: date.toLocaleDateString(),
      shots: [],
      goals: [],
    };
    this.store.dispatch(addGame({ game: game1 }));
    this.store.dispatch(addGame({ game: game2 }));
    this.store.dispatch(addGame({ game: game3 }));
  }
}
