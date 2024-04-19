export class NotePitch {

  static C = new NotePitch(0, 0, "C");
  static C_SHARP = new NotePitch(1, 0, "C#");
  static D = new NotePitch(2, 1, "D");
  static D_SHARP = new NotePitch(3, 1, "D#");
  static E = new NotePitch(4, 2, "E");
  static F = new NotePitch(5, 3, "F");
  static F_SHARP = new NotePitch(6, 3, "F#");
  static G = new NotePitch(7, 4, "G");
  static G_SHARP = new NotePitch(8, 4, "G#");
  static A = new NotePitch(9, 5, "A");
  static A_SHARP = new NotePitch(10, 5, "A#");
  static B = new NotePitch(11, 6, "B");


  constructor(pitchCode, position, label) {
    this.pitchCode = pitchCode;
    this.label = label;
    this.position = position;
  }

  static fromCode(pitchCode) {
    for (let notePitch of NotePitch.values()) {
      if (notePitch.pitchCode === pitchCode) {
        return notePitch;
      }
    }

    return null;
  }

  getPitchCode() {
    return this.pitchCode;
  }

  getLabel(options) {
    if(options.noAccidentals) {
      return this.label.replace('#', '');
    }
    return this.label;
  }

  /**
   * Note position relative to the staff.
   * Ex: C and #C have the same position on the staff so they both have position 0
   */
  getPosition() {
    return this.position;
  }

  static values() {
    return [
      new NotePitch(0, 0, "C"),
      new NotePitch(1, 0, "C#"),
      new NotePitch(2, 1, "D"),
      new NotePitch(3, 1, "D#"),
      new NotePitch(4, 2, "E"),
      new NotePitch(5, 3, "F"),
      new NotePitch(6, 3, "F#"),
      new NotePitch(7, 4, "G"),
      new NotePitch(8, 4, "G#"),
      new NotePitch(9, 5, "A"),
      new NotePitch(10, 5, "A#"),
      new NotePitch(11, 6, "B")
    ];
  }

  /**
   * @type {NotePitch}
   * @returns {number}
   **/
  compareTo(other) {
    if(this === other || this.getPitchCode() === other.getPitchCode()) {
      return 0;
    }
    if(other.getPitchCode() > this.getPitchCode()){
      return -1;
    }
    else {
      return 1;
    }
  }
}
