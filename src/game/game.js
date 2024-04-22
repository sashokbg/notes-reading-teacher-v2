import {MidiHandler} from "../midi/midi";
import {Note} from "../notes/note";
import {NotesGuesser} from "../guesser/guesser";
import {NotesRenderer} from "../renderer/notes_renderer";
import {NoteGuessResult} from "../guesser/note_guess_result";
import {NoteGuess} from "../guesser/note_guess";
import {Clef} from "../notes/clef";

export const MAX_NUMBER_OF_NOTES = 16;
export const NOTES_PER_BAR = 8;

export class Game {
  noteGuesses = [];
  currentNoteGuess = 0;
  currentClef = Clef.G;

  constructor() {
    this.renderer = new NotesRenderer();
    this.notesGuesser = new NotesGuesser();
    new MidiHandler(this);
    this.advanceToNextLine();
  }

  advanceToNextLine() {
    /** @type {NoteGuess[]}**/
    this.noteGuesses = [];
    this.currentNoteGuess = 0;

    for(let i = 0; i< MAX_NUMBER_OF_NOTES; i++) {
      this.noteGuesses.push(this.notesGuesser.randomNote());
    }

    this.renderer.printNoteGuesses(this.noteGuesses);
  }

  /**
   * @type {Note}
   * @param note
   */
  stopGuessNote(note) {
    if (this.noteGuesses[this.currentNoteGuess].getNote() !== note) {
      this.renderer.removeMistakes(note);
    }
  }

  /**
   * @param {Note} note
   * @param {boolean} forceRightGuess
   *
   * @returns {NoteGuessResult} the guess result.
   */
  guessNote(note, forceRightGuess) {
    if (
      this.noteGuesses[this.currentNoteGuess].getNote().equals(note) ||
      forceRightGuess
    ) {
      this.currentNoteGuess++;
      this.currentClef = this.currentClef.next();
      const isLastNote = this.currentNoteGuess >= MAX_NUMBER_OF_NOTES;
      if (!isLastNote) {
        this.renderer.printIndicator(this.currentNoteGuess);
      }

      if(isLastNote){
        this.advanceToNextLine();
      }

      return new NoteGuessResult(true, isLastNote);
    } else {
      const noteGuess = new NoteGuess(note, this.currentClef);
      noteGuess.setMistake(true);
      this.renderer.printMistake(noteGuess, this.currentNoteGuess);
      return new NoteGuessResult(false, false);
    }
  }
}
