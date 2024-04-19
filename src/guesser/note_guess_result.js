export class NoteGuessResult {
  constructor(isCorrect, isLastNote) {
    this.isCorrect = isCorrect;
    this.isLastNote = isLastNote;
  }

  isCorrect() {
    return this.isCorrect;
  }

  isLastNote() {
    return this.isLastNote;
  }
}
