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
      goals: [
        {
            "shotX": 148,
            "shotY": 253,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        }
      ],
      shots: [
        {
            "shotX": 158.5,
            "shotY": 142.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 343,
            "shotY": 157,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 262,
            "shotY": 185,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 487,
            "shotY": 191.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 296,
            "shotY": 265.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 409,
            "shotY": 234.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 221,
            "shotY": 222,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 158.5,
            "shotY": 189.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 226.5,
            "shotY": 131.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 488.5,
            "shotY": 143.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 402,
            "shotY": 113,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 359,
            "shotY": 219,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 423,
            "shotY": 303,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 111.5,
            "shotY": 170.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 138,
            "shotY": 243,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 423.5,
            "shotY": 266,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 535.5,
            "shotY": 267.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 513,
            "shotY": 211,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        },
        {
            "shotX": 425,
            "shotY": 149.5,
            "screened": false,
            "changedDirection": false,
            "crossedCenterline": false
        }
    ]};
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
