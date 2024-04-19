import {Note} from '../notes/note'

export class NoteGuess {
  constructor(note, clef) {

    /** @type {Note}**/
    this.note = note;
    this.clef = clef;
    this._isMistake = false;
  }

  getNote() {
    return this.note;
  }

  setNote(note) {
    this.note = note;
  }

  getClef() {
    return this.clef;
  }

  setClef(clef) {
    this.clef = clef;
  }

  setMistake(isMistake) {
    this._isMistake = isMistake;
  }

  isMistake() {
    return this._isMistake;
  }

  toString() {
    return `Note guess: ${this.note} clef: ${this.clef}`;
  }
}
