import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, QueryList, Signal, signal, ViewChildren } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NewGameComponent } from "../new-game/new-game.component";
import { DatePipe, DecimalPipe, NgFor, NgIf, NgStyle, PercentPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { selectCurrentGame, selectGames } from '../ngrx/selectors/games.selectors';
import { updateGame, changeSelectedGame } from '../ngrx/actions/games-state.actions';
import { Game } from '../models/game.model';
import { Shot } from '../models/shot.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ShotTriangle } from '../models/shot-triangle.model';

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
    MatIconModule,
    PercentPipe,
    DecimalPipe
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
  readonly totalGoals: Signal<number> = computed(() => this.currentGameGoals().length);
  readonly totalShots: Signal<number> = computed(() => this.currentGameShots().length + this.currentGameGoals().length);
  readonly savePercentage: Signal<number> = computed(() => 1 - (this.currentGameGoals().length / this.totalShots()));
  readonly expectedGoals: Signal<number> = computed(() => this.getExcpectedGoalsFromShotList(this.currentGameShots()) + this.getExcpectedGoalsFromShotList(this.currentGameGoals()));
  readonly goalsSavedAboveExpected: Signal<number> = computed(() => this.expectedGoals() - this.totalGoals());

  readonly defaultGame: Game = {
    teamName: '',
    opponentName: '',
    startDate: '',
    shots: [],
    goals: [],
  }

  private readonly goalCoordinates = { x: 300.406, y: 455.406 }
  private readonly goalLineToBlueLineInInches: number = 768;
  private readonly goalLineToBlueLineInPixels: number = 382;
  private readonly pixelsPerInch: number = this.goalLineToBlueLineInInches / this.goalLineToBlueLineInPixels;
  private readonly goalLineY: number = 455.40625;

  private readonly anglePercentages = [
    {
      angleMax: 15,
      expectedSavePercentage: 0.877
    },
    {
      angleMax: 30,
      expectedSavePercentage: 0.903
    },
    {
      angleMax: 45,
      expectedSavePercentage: 0.926
    },
    {
      angleMax: 60,
      expectedSavePercentage: 0.928
    },
    {
      angleMax: 75,
      expectedSavePercentage: 0.942
    },
    {
      angleMax: 90,
      expectedSavePercentage: 0.955
    },
    {
      angleMax: 105,
      expectedSavePercentage: 0.955
    }
  ]

  private readonly distancePercentages = [
    {
      distanceMax: 10,
      expectedSavePercentage: 0.794
    },
    {
      distanceMax: 20,
      expectedSavePercentage: 0.845
    },
    {
      distanceMax: 30,
      expectedSavePercentage: 0.894
    },
    {
      distanceMax: 40,
      expectedSavePercentage: 0.951
    },
    {
      distanceMax: 50,
      expectedSavePercentage: 0.978
    },
    {
      distanceMax: 60,
      expectedSavePercentage: 0.979
    },
    {
      distanceMax: 70,
      expectedSavePercentage: 0.985
    },
    {
      distanceMax: 80,
      expectedSavePercentage: 0.997
    }
  ]

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

    const distance = this.caclulateShotDistanceInFeet(x,y);
    const angle = this. calculateShotAngle(x,y);

    let savePct: number = this.distancePercentages.find((p) => p.distanceMax >= distance)?.expectedSavePercentage || 0;
    savePct = savePct * (this.anglePercentages?.find((p) => p.angleMax >= angle)?.expectedSavePercentage || 0);

    const shot: Shot = {
      shotX: x,
      shotY: y,
      screened: false,
      changedDirection: false,
      crossedCenterline: false,
      shotDistanceInFeet: distance,
      shotAngle: angle,
      expectedSavePercentage: savePct
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

  private caclulateShotDistanceInFeet(shotX: number, shotY: number): number {
    const sideLengthsInPixels: ShotTriangle = this.getSideLengthsInPixels(shotX,shotY);
    const shotDistanceInPixels: number = sideLengthsInPixels.c;
    const shotDistanceInInches: number = shotDistanceInPixels * this.pixelsPerInch;
    const shotDistanceInFeet: number = shotDistanceInInches / 12;
    return shotDistanceInFeet;
  }

  private calculateShotAngle(shotX: number, shotY: number): number {
    const shotTriangle: ShotTriangle = this.getSideLengthsInPixels(shotX,shotY);
    let shotAngleInRadians: number = Math.asin(shotTriangle.b / shotTriangle.c);
    let shotAngleInDegrees: number = this.convertRadianToDegree(shotAngleInRadians);
    if(shotY > this.goalLineY){
      shotAngleInDegrees = shotAngleInDegrees + 90;
    }
    return shotAngleInDegrees;
  }

  private getSideLengthsInPixels(shotX: number, shotY: number): ShotTriangle {
    const shotXInPixels: number = Math.abs(this.goalCoordinates.x - shotX);
    const aSquaredInPixels: number = shotXInPixels * shotXInPixels;
    const shotYInPixels: number = Math.abs(this.goalCoordinates.y - shotY);
    const bSquaredInPixels: number = shotYInPixels * shotYInPixels;
    const cSquaredInPixels: number = aSquaredInPixels + bSquaredInPixels;
    return { a: Math.sqrt(aSquaredInPixels), b: Math.sqrt(bSquaredInPixels), c: Math.sqrt(cSquaredInPixels)};
  }

  private convertRadianToDegree(r: number): number {
    return r * 180 * Math.PI ** -1;
  }

  private getExcpectedGoalsFromShotList(shots: Shot[]): number {
    const expectedGoalList: number[] = shots.map((s) => 1- s.expectedSavePercentage);
    if(!expectedGoalList || expectedGoalList.length < 1){
      return 0;
    }
    const expectedGoals: number = expectedGoalList.reduce((acc, cur) => acc + cur);
    return expectedGoals;
  }
}
