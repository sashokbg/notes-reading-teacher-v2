import {NotePitch} from "./note_pitch";

export class Note {
  constructor(pitch, octave) {

    if (octave) {
      /** @type {NotePitch} **/
      this.notePitch = pitch;
      this.octave = octave;
    } else {
      let relativePitch = pitch % 12;

      this.notePitch = NotePitch.fromCode(relativePitch);
      this.octave = Math.floor(pitch / 12) - 1; // scientifically octaves start from -1
    }
  }

  getAbsolutePitch() {
    // octaves start at -1 so octave + 1
    return ((this.octave + 1) * 12) + this.notePitch.getPitchCode();
  }

  /**
   * @return {NotePitch}
   */
  getPitch() {
    return this.notePitch;
  }

  getOctave() {
    return this.octave;
  }

  setOctave(octave) {
    this.octave = octave;
  }

  getLabel() {
    return this.notePitch.getLabel({noAccidentals: true}) + '/' + this.octave;
  }


  toString() {
    return this.notePitch.getLabel() + this.getOctave();
  }

  /**
   * Note position relative to the staff.
   * Ex: C and #C have the same position on the staff so they both have position 0
   */
  getPosition() {
    return this.notePitch.getPosition();
  }

  nextWholeNote() {
    if (this.notePitch === NotePitch.E || this.notePitch === NotePitch.B || this.isSharp()) {
      return new Note(this.getAbsolutePitch() + 1);
    } else {
      return new Note(this.getAbsolutePitch() + 2);
    }
  }

  previousWholeNote() {
    if (this.notePitch === NotePitch.F || this.notePitch === NotePitch.C || this.isSharp()) {
      return new Note(this.getAbsolutePitch() - 1);
    } else {
      return new Note(this.getAbsolutePitch() - 2);
    }
  }

  isSharp() {
    return this.notePitch.compareTo(NotePitch.C_SHARP) === 0 ||
      this.notePitch.compareTo(NotePitch.D_SHARP) === 0 ||
      this.notePitch.compareTo(NotePitch.F_SHARP) === 0||
      this.notePitch.compareTo(NotePitch.G_SHARP) === 0||
      this.notePitch.compareTo(NotePitch.A_SHARP) === 0;
  }

  equals(otherNote) {
    return this.octave === otherNote.octave &&
      this.notePitch === otherNote.notePitch;
  }

  isGreaterThan(otherNote) {
    return this.compareTo(otherNote) > 0;
  }

  compareTo(otherNote) {
    if (otherNote.getOctave() > this.getOctave()) {
      return -1;
    } else if (otherNote.getOctave() < this.getOctave()) {
      return 1;
    } else {
      return this.notePitch.compareTo(otherNote.notePitch);
    }
  }
}