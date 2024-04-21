export class Clef  {
  static F = new Clef('F');
  static G = new Clef('G');
  static NONE = new Clef('NONE');


  constructor(value) {
    this.value = value;
  }

  equals(other) {
    if(this === other) {
      return true;
    }

    return this.value === other.value;
  }

  toString() {
    return this.equals(Clef.G) ? 'treble' : 'bass'
  }

  next() {
    if(this.equals(Clef.F)) {
      return Clef.G;
    } else {
      return Clef.F;
    }
  }
}