import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, QueryList, Signal, signal, ViewChildren } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NewGameComponent } from "../new-game/new-game.component";
import { DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { selectCurrentGame, selectGames } from '../ngrx/selectors/games.selectors';
import { updateGame, changeSelectedGame } from '../ngrx/actions/games-state.actions';
import { Game } from '../models/game.model';
import { Shot } from '../models/shot.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-games',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatExpansionModule,
    NewGameComponent,
    NgIf,
    MatButtonModule,
    NgFor,
    DatePipe,
    NgStyle,
    MatTooltipModule,
    MatIconModule
],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamesComponent {
  private readonly store = inject(Store);

  readonly showNewGameForm = signal(false);

  readonly games = this.store.selectSignal(selectGames);
  readonly currentGame = this.store.selectSignal(selectCurrentGame);
  readonly currentGameShots: Signal<Shot[]> = computed(() => this.currentGame()?.shots || []);
  readonly currentGameGoals: Signal<Shot[]> = computed(() => this.currentGame()?.goals || []);

  readonly defaultGame: Game = {
    teamName: '',
    opponentName: '',
    startDate: '',
    shots: [],
    goals: [],
  }

  @ViewChildren('rinkImg') rinkImg!: QueryList<ElementRef>;
  yDistance: number = 0;
  xDistance: number = 0;

  toggleNewGame(): void {
    this.showNewGameForm.update((showNewGame) => !showNewGame)
  }

  addShotToImage(pointerEvent: MouseEvent, elementNumber: number): void {
    this.calculateDistance(elementNumber);
    let x = (pointerEvent.pageX - this.xDistance) + 60;
    let y = (pointerEvent.pageY - this.yDistance) + 115;

    const shot: Shot = {
      shotX: x,
      shotY: y,
      screened: false,
      changedDirection: false,
      crossedCenterline: false
    }
    if(this.currentGame()){
      let game = this.currentGame() || this.defaultGame;
      if(pointerEvent.shiftKey === true){
        game = {
          ...game,
          goals: [
            ...game.goals || [],
            shot
          ]
        };
      }else {
        game = {
          ...this.currentGame() || this.defaultGame,
          shots: [
            ...this.currentGame()?.shots || [],
            shot
          ]
        };
      }
      this.store.dispatch(updateGame({ game }));
    }
  }

  setSelectedGame(game: Game): void {
    this.store.dispatch(changeSelectedGame({game}));
  }

  undoLastShot(): void {
    let game = this.currentGame() || this.defaultGame;
    game = {
      ...this.currentGame() || this.defaultGame,
      shots: [
        ...this.removeLastShot(game)
      ]
    };
    this.store.dispatch(updateGame({ game }));
  }

  undoLastGoal(): void {
    let game = this.currentGame() || this.defaultGame;
    game = {
      ...this.currentGame() || this.defaultGame,
      goals: [
        ...this.removeLastGoal(game)
      ]
    };
    this.store.dispatch(updateGame({ game }));
  }

  private calculateDistance(elementIndex: number) {
    const element = this.rinkImg.find((_, index) => index === elementIndex);
    const rect = element?.nativeElement.getBoundingClientRect();
    this.yDistance = rect.top + window.screenTop;
    this.xDistance = rect.left + window.screenLeft;
  }

  private removeLastShot(game: Game): Shot[] {
    const shots: Shot[] = [
      ...game.shots
    ]

    shots.pop();
    return shots;
  }

  private removeLastGoal(game: Game): Shot[] {
    const goals: Shot[] = [
      ...game.goals
    ]

    goals.pop();
    return goals;
  }
}
