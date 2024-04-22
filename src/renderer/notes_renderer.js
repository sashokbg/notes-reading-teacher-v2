import {Accidental, Formatter, Renderer, Stave, StaveNote, Vex, Voice} from "vexflow";
import {NoteGuess} from "../guesser/note_guess";
import {Clef} from "../notes/clef";
import {MAX_NUMBER_OF_NOTES, NOTES_PER_BAR} from "../game/game";

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
    let width = 260;

    let treble1 = new Stave(60, 40, width);
    let treble2 = new Stave(width + 60, 40, width);
    let bass1 = new Stave(60, 160, width);
    let bass2 = new Stave(width + 60, 160, width);
    this.trebles.push(treble1);
    this.trebles.push(treble2);
    this.basses.push(bass1);
    this.basses.push(bass2);

    /**
     *
     * @type {StaveNote[]}
     */
    this.notes = [];

    treble1.addClef("treble").addTimeSignature("8/8");
    bass1.addClef("bass").addTimeSignature("8/8");

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
    this.notes = [];
    this.removeNotes();
    this.context.openGroup('', 'guess-notes');
    let noteCounter = 0;

    while (noteCounter < noteGuesses.length / NOTES_PER_BAR) {
      let trebleNotes = [];
      let bassNotes = [];

      for (let i = noteCounter * NOTES_PER_BAR; i < noteCounter * NOTES_PER_BAR + NOTES_PER_BAR; i++) {
        let noteGuess = noteGuesses[i];

        let note = noteGuess.note;
        let staveNote = new StaveNote({
          keys: [note.getLabel()],
          duration: "8",
          clef: noteGuess.clef.toString()
        });

        this.notes.push(staveNote);

        if (noteGuess.clef.equals(Clef.G)) {
          trebleNotes.push(staveNote)
          bassNotes.push(new StaveNote({
            keys: ['f/3'],
            duration: '8r',
            clef: 'bass'
          }))
        } else {
          bassNotes.push(staveNote)
          trebleNotes.push(new StaveNote({
            keys: ['g/4'],
            duration: '8r',
            clef: 'treble'
          }))
        }
      }

      const trebleVoice = new Voice({
        num_beats: NOTES_PER_BAR,
        beat_value: NOTES_PER_BAR,
      }).addTickables(trebleNotes);

      const bassVoice = new Voice({
        num_beats: NOTES_PER_BAR,
        beat_value: NOTES_PER_BAR,
      }).addTickables(bassNotes);

      new Formatter().joinVoices([trebleVoice]).format([trebleVoice]);
      trebleVoice.draw(this.context, this.trebles[noteCounter]);

      new Formatter().joinVoices([bassVoice]).format([bassVoice]);
      bassVoice.draw(this.context, this.basses[noteCounter]);
      noteCounter++;
    }

    this.printIndicator(0);

    this.context.closeGroup();
  }

  /**
   *
   * @param {NoteGuess} noteGuess
   * @param {number} currentNoteGuess
   */
  printMistake(noteGuess, currentNoteGuess) {
    this.context.openGroup('mistakes', noteGuess.note.getLabel());

    let note = noteGuess.note;
    let staveNote = new StaveNote({
      keys: [note.getLabel()],
      duration: "1",
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


    let xShift = this.notes[currentNoteGuess].getX();
    staveNote.setXShift(xShift);

    if (note.isSharp()) {
      const accidental = new Accidental('#');
      accidental.setXShift(xShift);
      staveNote.addModifier(accidental);
    }

    // let startIndex = Math.floor(currentNoteGuess / NOTES_PER_BAR) * NOTES_PER_BAR;
    const voice = new Voice({
      num_beats: NOTES_PER_BAR,
      beat_value: NOTES_PER_BAR,
    }).addTickables([staveNote]);

    new Formatter().joinVoices([voice]).format([voice]);

    voice.draw(this.context, noteGuess.clef.equals(Clef.G) ? this.trebles[Math.floor(currentNoteGuess / NOTES_PER_BAR)] : this.basses[Math.floor(currentNoteGuess / NOTES_PER_BAR)]);
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

    let offset = 0;
    let step = 30;
    let x = offset + this.notes[position].getAbsoluteX() + 5;

    const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle.setAttribute("id", "indicator");
    triangle.setAttribute("points", `${x - 5},20 ${x},50 ${x + 5},20`);
    triangle.setAttribute("fill", "red");
    svg.appendChild(triangle);
  }
}