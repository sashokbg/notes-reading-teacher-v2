export class NoteGuessResult {
  constructor(isCorrect, isLastNote) {
    this._isCorrect = isCorrect;
    this._isLastNote = isLastNote;
  }

  isCorrect() {
    return this._isCorrect;
  }

  isLastNote() {
    return this._isLastNote;
  }
}
