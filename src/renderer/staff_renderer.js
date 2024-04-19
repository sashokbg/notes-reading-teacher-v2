import {Accidental, Formatter, Renderer, Stave, StaveNote, Vex, Voice} from "vexflow";

const {Factory, System} = Vex.Flow;

export class NotesRenderer {

  constructor() {
    const div = document.getElementById("output");
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(500, 500);


    this.context = renderer.getContext();

    // Create a stave of width 400 at position 10, 40 on the canvas.
    this.stave = new Stave(10, 40, 400);

    // Add a clef and time signature.
    this.stave.addClef("treble").addTimeSignature("4/4");
    this.stave.addClef("bass").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    this.stave.setContext(this.context).draw();
  }


  /**
   * @type {NoteGuess[]}
   **/
  printNoteGuesses(noteGuesses) {
    // notes = ['C#5/q','B4', 'A4', 'G#4'];
    this.group = this.context.openGroup('', 'guess-notes');
    let notes = [];

    for (let i = 0; i < noteGuesses.length; i++) {
      let noteGuess = noteGuesses[i];

      let note = noteGuess.note;
      let staveNote = new StaveNote({
        keys: [note.getLabel()],
        duration: "q",
      });

      notes.push(staveNote)
    }

    const voice = new Voice({
      num_beats: 4,
      beat_value: 4,
    }).addTickables(notes);

    new Formatter().joinVoices([voice]).format([voice], 350);
    voice.draw(this.context, this.stave);

    this.context.closeGroup();
  }

  printMistake(noteGuess, currentNoteGuess) {
    this.mistakesGroup = this.context.openGroup('mistakes', noteGuess.note.getLabel());

    let note = noteGuess.note;
    let staveNote = new StaveNote({
      keys: [note.getLabel()],
      duration: "h",
    });

    if(note.isSharp()) {
      staveNote.addModifier(new Accidental('#'))
    }

    let staveNote2 = new StaveNote({
      keys: ['c/-1'],
      duration: "hr",
    });
    const voice = new Voice({
      num_beats: 4,
      beat_value: 4,
    }).addTickables([staveNote2, staveNote]);

    new Formatter().joinVoices([voice]).format([voice], 350);
    voice.draw(this.context, this.stave);

    this.context.closeGroup();
  }

  removeMistakes(note) {
    document.getElementById('vf-' + note.getLabel()).remove();
  }
}