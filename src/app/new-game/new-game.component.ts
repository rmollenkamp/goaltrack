import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Game } from '../models/game.model';
import { addGame } from '../ngrx/actions/games-state.actions';

@Component({
  selector: 'app-new-game',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './new-game.component.html',
  styleUrl: './new-game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewGameComponent {
  private readonly store = inject(Store);

  readonly newGameForm = new FormGroup({
    teamName: new FormControl('', [Validators.required]),
    opponentName: new FormControl('', [Validators.required]),
    gameStartDate: new FormControl('', [Validators.required])
  })

  @Output() close: EventEmitter<void> = new EventEmitter();

  closeForm(): void {
    this.close.emit();
  }

  saveGame(): void {
    if(!this.newGameForm.controls.teamName.touched){
      console.log('Form Not Complete');
      return;
    }
    if(this.newGameForm.invalid){
      console.log('Form is Invalid');
      return;
    }
    if(this.newGameForm.valid && this.newGameForm.touched){
      console.log('Saving Game...')
      const game: Game = {
        teamName: this.newGameForm.controls?.teamName?.value?.toString() || '',
        opponentName: this.newGameForm.controls.opponentName.value?.toString() || '',
        startDate: this.newGameForm.controls.gameStartDate.value?.toString() || '',
        shots: [],
        goals: [],
      }
  
      this.store.dispatch(addGame({game}));
    }
    this.close.emit();
  }
}
