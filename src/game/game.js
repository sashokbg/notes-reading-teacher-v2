import {MidiHandler} from "../midi/midi";
import {Note} from "../notes/note";
import {Staff} from "./staff";
import {Clef} from "../notes/clef";
import {NotesGuesser} from "../guesser/notes_guesser";

export const MAX_NUMBER_OF_NOTES = 4;

export class Game {

  /** @type {Staff} **/
  staff1 = null;
  /** @type {Staff} **/
  staff2 = null;

  constructor() {
    this.staff1 = new Staff(Clef.G);
    this.staff2 = new Staff(Clef.F);

    this.notesGuesser = new NotesGuesser();
    new MidiHandler(this);
    this.advanceToNextLine();
  }

  advanceToNextLine() {
    /** @type {[NoteGuess]}**/
    const noteGuessList = [];

    for(let i = 0; i< MAX_NUMBER_OF_NOTES; i++) {
      noteGuessList.push(this.notesGuesser.randomNote());
    }

    this.staff1.advanceToNextLine(noteGuessList);
    if (this.staff2 != null) {
      this.staff2.advanceToNextLine(noteGuessList);
    }
  }

  /**
   * @type {Note}
   * @param note
   */
  stopGuessNote(note) {
    this.staff1.stopGuessNote(note);
    if(this.staff2) {
      this.staff2.stopGuessNote(note);
    }
  }

  /**
   * @type {Note}
   * @type {boolean}
   * @param note
   * @param forceRightGuess
   */
  guessNote(note, forceRightGuess) {
    console.log('Guessing note, ', note);
    const result1 = this.staff1.guessNote(note, forceRightGuess);
    let result2 = null;
    if(this.staff2 != null){
      result2 = this.staff2.guessNote(note, forceRightGuess);
    }

    if(result1.isLastNote() || ( result2 != null && result2.isLastNote())){
      this.advanceToNextLine();
    }
  }

}