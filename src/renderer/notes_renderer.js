import {Accidental, Formatter, Renderer, Stave, StaveNote, Vex, Voice} from "vexflow";
import {NoteGuess} from "../guesser/note_guess";
import {Clef} from "../notes/clef";

export class NotesRenderer {

  constructor() {
    const div = document.getElementById("output");
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    this.currentNotesToPrint = {
      index: 0,
      notes: []
    }

    renderer.resize(1200, 600);

    this.trebles = [];
    this.basses = [];

    this.context = renderer.getContext();
    this.renderStaves();
  }

  renderStaves() {
    let treble1 = new Stave(60, 40, 400);
    let treble2 = new Stave(460, 40, 400);
    let bass1 = new Stave(60, 140, 400);
    let bass2 = new Stave(460, 140, 400);
    this.trebles.push(treble1);
    this.trebles.push(treble2);
    this.basses.push(bass1);
    this.basses.push(bass2);

    treble1.addClef("treble").addTimeSignature("4/4");
    bass1.addClef("bass").addTimeSignature("4/4");

    treble1.setContext(this.context).draw();
    treble2.setContext(this.context).draw();
    bass1.setContext(this.context).draw();
    bass2.setContext(this.context).draw();

    const brace = new Vex.Flow.StaveConnector(treble1, bass1).setType(3);
    const lineLeft = new Vex.Flow.StaveConnector(treble1, bass1).setType(1);
    const lineRight = new Vex.Flow.StaveConnector(treble2, bass2).setType(6);

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
    let noteCounter = 0;

    while(noteCounter < noteGuesses.length / 4) {
      let trebleNotes = [];
      let bassNotes = [];

      for (let i = noteCounter * 4; i < noteCounter * 4 + 4; i++) {
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
      trebleVoice.draw(this.context, this.trebles[noteCounter]);

      new Formatter().joinVoices([bassVoice]).format([bassVoice], 350);
      bassVoice.draw(this.context, this.basses[noteCounter]);
      noteCounter++;
    }


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

    let startIndex = Math.floor(currentNoteGuess / 4) * 4;
    for(let i = startIndex; i < currentNoteGuess; i++) {
      firstRests.push(new StaveNote({
        keys: ['c/-1'],
        duration: "qr",
      }));
    }

    const afterRests = [];

    for(let i = currentNoteGuess; i < startIndex + 3; i++) {
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

    voice.draw(this.context, noteGuess.clef.equals(Clef.G) ? this.trebles[Math.floor(currentNoteGuess / 4)] : this.basses[Math.floor(currentNoteGuess / 4)]);

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