import {Accidental, Formatter, Renderer, Stave, StaveNote, Vex, Voice} from "vexflow";

const {Factory, System} = Vex.Flow;
import {NoteGuess} from "../guesser/note_guess";
import {Clef} from "../notes/clef";

export class NotesRenderer {

  constructor() {
    const div = document.getElementById("output");
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(600, 600);

    this.context = renderer.getContext();

    // Create a stave of width 400 at position 10, 40 on the canvas.
    this.treble = new Stave(60, 40, 460);
    this.bass = new Stave(60, 140, 460);

    // Add a clef and time signature.
    this.treble.addClef("treble").addTimeSignature("4/4");
    this.bass.addClef("bass").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    this.treble.setContext(this.context).draw();
    this.bass.setContext(this.context).draw();

    const brace = new Vex.Flow.StaveConnector(this.treble, this.bass).setType(3);
    const lineLeft = new Vex.Flow.StaveConnector(this.treble, this.bass).setType(1);
    const lineRight = new Vex.Flow.StaveConnector(this.treble, this.bass).setType(6);

    brace.setContext(this.context).draw();
    lineLeft.setContext(this.context).draw();
    lineRight.setContext(this.context).draw();

  }


  /**
   * @param {NoteGuess[]} noteGuesses
   **/
  printNoteGuesses(noteGuesses) {
    this.printIndicator(0);
    this.removeNotes();
    this.group = this.context.openGroup('', 'guess-notes');
    let trebleNotes = [];
    let bassNotes = [];

    for (let i = 0; i < noteGuesses.length; i++) {
      let noteGuess = noteGuesses[i];

      let note = noteGuess.note;
      let staveNote = new StaveNote({
        keys: [note.getLabel()],
        duration: "q",
        clef: noteGuess.clef.toString()
      });

      if(noteGuess.clef.equals(Clef.G)){
        trebleNotes.push(staveNote)
        bassNotes.push(new StaveNote({
          keys: ['f/3'],
          duration: 'qr',
          clef: 'bass'
        }))
      } else {
        bassNotes.push(staveNote)
        trebleNotes.push(new StaveNote({
          keys: ['g/4'],
          duration: 'qr',
          clef: 'treble'
        }))
      }
    }

    const trebleVoice = new Voice({
      num_beats: 4,
      beat_value: 4,
    }).addTickables(trebleNotes);

    const bassVoice = new Voice({
      num_beats: 4,
      beat_value: 4,
    }).addTickables(bassNotes);

    new Formatter().joinVoices([trebleVoice]).format([trebleVoice], 350);
    trebleVoice.draw(this.context, this.treble);

    new Formatter().joinVoices([bassVoice]).format([bassVoice], 350);
    bassVoice.draw(this.context, this.bass);

    this.context.closeGroup();
  }

  /**
   *
   * @param {NoteGuess} noteGuess
   * @param {number} currentNoteGuess
   */
  printMistake(noteGuess, currentNoteGuess) {
    this.mistakesGroup = this.context.openGroup('mistakes', noteGuess.note.getLabel());

    let note = noteGuess.note;
    let staveNote = new StaveNote({
      keys: [note.getLabel()],
      duration: "q",
      clef: noteGuess.clef.toString()
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
    voice.draw(this.context, noteGuess.clef.equals(Clef.G) ? this.treble : this.bass);

    this.context.closeGroup();
  }

  removeNotes() {
    document.getElementById('vf-guess-notes')?.remove();
  }

  removeMistakes(note) {
    document.getElementById('vf-' + note.getLabel())?.remove();
  }

  printIndicator(position) {
    const svg = document.getElementById('output').getElementsByTagName('svg')[0];
    document.getElementById("indicator")?.remove();

    let offset = 140;
    let x = offset + position * 85;

    const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle.setAttribute("id", "indicator");
    triangle.setAttribute("points", `${x-5},20 ${x},50 ${x+5},20`);
    triangle.setAttribute("fill", "red");
    svg.appendChild(triangle);
  }
}