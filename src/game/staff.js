import {MAX_NUMBER_OF_NOTES} from "./game";
import {NoteGuessResult} from "../guesser/note_guess_result";
import {NoteGuess} from "../guesser/note_guess";
import {NotesRenderer} from "../renderer/staff_renderer";
import {Note} from "../notes/note";

export class Staff {
  constructor(clef, hideNoteIndicator) {
    this.clef = clef;
    this.hideNoteIndicator = hideNoteIndicator;
    this.renderer = new NotesRenderer();
  }

  advanceToNextLine(noteGuessList) {
    this.noteGuessList = noteGuessList;
    this.currentNoteGuess = 0;
    this.renderer.printNoteGuesses(noteGuessList);
    // if (!this.properties.hideIndicator) {
    //   this.printer.printNoteIndicator(this.currentNoteGuess);
    // }
  }


  /**
   * @type {Note}
   * @param note
   */
  stopGuessNote(note) {
    if (this.noteGuessList[this.currentNoteGuess].getNote() !== note) {
      this.renderer.removeMistakes(note);
    }
  }

  guessNote(note, forceRightGuess) {
    if (
      this.noteGuessList[this.currentNoteGuess].getNote().equals(note) ||
      forceRightGuess
    ) {
      this.currentNoteGuess++;
      const isLastNote = this.currentNoteGuess >= MAX_NUMBER_OF_NOTES;
      if (!isLastNote) {
        // this.printer.printNoteIndicator(this.currentNoteGuess);
      }
      return new NoteGuessResult(true, isLastNote);
    } else {
      const noteGuess = new NoteGuess(note, null);
      noteGuess.setMistake(true);
      this.renderer.printMistake(noteGuess, this.currentNoteGuess);
      return new NoteGuessResult(false, false);
    }
  }
}
