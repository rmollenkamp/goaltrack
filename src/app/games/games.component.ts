import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NewGameComponent } from "../new-game/new-game.component";
import { DatePipe, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { selectGames } from '../ngrx/selectors/games.selectors';

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
    NgOptimizedImage
],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamesComponent {
  private readonly store = inject(Store);

  readonly panelOpenState = signal(false);
  readonly showNewGameForm = signal(false);

  readonly games = this.store.selectSignal(selectGames);

  toggleNewGame(): void {
    this.showNewGameForm.update((showNewGame) => !showNewGame)
  }
}
