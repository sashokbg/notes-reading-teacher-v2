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
    this.stave2 = new Stave(10, 140, 400);

    // Add a clef and time signature.
    this.stave.addClef("treble").addTimeSignature("4/4");
    this.stave2.addClef("bass").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    this.stave.setContext(this.context).draw();
    this.stave2.setContext(this.context).draw();
  }


  /**
   * @type {NoteGuess[]}
   **/
  printNoteGuesses(noteGuesses) {
    this.removeNotes();
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
      duration: "q",
    })
      .setStemStyle({
        fillStyle: '#ff0000',
        strokeStyle: '#ff0000',
      })
      .setStyle({
        shadowColor: '#ff0000',
        fillStyle: '#ff0000',
      });

    if (note.isSharp()) {
      staveNote.addModifier(new Accidental('#'))
    }

    const firstRests = [];

    for(let i = 0; i < currentNoteGuess; i++) {
      firstRests.push(new StaveNote({
        keys: ['c/-1'],
        duration: "qr",
      }));
    }

    const afterRests = [];

    for(let i = currentNoteGuess; i < 3; i++) {
      afterRests.push(new StaveNote({
        keys: ['c/-1'],
        duration: "qr",
      }));
    }


    const voice = new Voice({
      num_beats: 4,
      beat_value: 4,
    }).addTickables([...firstRests, staveNote, ...afterRests]);

    new Formatter().joinVoices([voice]).format([voice], 350);
    voice.draw(this.context, this.stave);

    this.context.closeGroup();
  }

  removeNotes() {
    document.getElementById('vf-guess-notes')?.remove();
  }

  removeMistakes(note) {
    document.getElementById('vf-' + note.getLabel())?.remove();
  }
}