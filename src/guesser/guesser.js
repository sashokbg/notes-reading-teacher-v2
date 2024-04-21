import {Clef} from "../notes/clef";
import {Note} from "../notes/note";
import {NotePitch} from "../notes/note_pitch";
import {NoteGuess} from "./note_guess";

export class NotesGuesser {
    static MIN_NOTE_F = new Note(NotePitch.E, 2);
    static MAX_NOTE_F = new Note(NotePitch.E, 4);
    static MIN_NOTE_G = new Note(NotePitch.A, 3);
    static MAX_NOTE_G = new Note(NotePitch.C, 6);

    constructor(initialClef = Clef.NONE, random = Math.random) {
        this.random = random;
        this.initialClef = initialClef;
        this.clef = Clef.F;
        this.setNotesRange(this.initialClef || Clef.NONE);
    }

    setNotesRange(clef) {
        if (clef === Clef.F) {
            this.minNote = NotesGuesser.MIN_NOTE_F;
            this.maxNote = NotesGuesser.MAX_NOTE_F;
        } else if (clef === Clef.G) {
            this.minNote = NotesGuesser.MIN_NOTE_G;
            this.maxNote = NotesGuesser.MAX_NOTE_G;
        } else {
            this.minNote = NotesGuesser.MIN_NOTE_F;
            this.maxNote = NotesGuesser.MAX_NOTE_G;
        }
    }

    randomNote() {
        let pitchCode = 0;
        const currentNoteClef = this.getClef();
        this.setNotesRange(currentNoteClef);

        let note = new Note(pitchCode);

        while (this.minNote.isGreaterThan(note)) {
            pitchCode = Math.floor(this.random() * this.maxNote.getAbsolutePitch());
            note = new Note(pitchCode);
        }

        if (note.isGreaterThan(this.maxNote)) {
            console.error("A max note higher than the expected has been generated !");
            note = this.maxNote;
        }

        if (note.isSharp()) {
            note = new Note(
                NotePitch.fromCode(note.notePitch.getPitchCode() + 1),
                note.getOctave()
            );
        }

        return new NoteGuess(note, currentNoteClef);
    }


    getClef() {
        if(this.initialClef === Clef.NONE) {
            if(this.clef === Clef.F) {
                this.clef = Clef.G;
            } else {
                this.clef = Clef.F;
            }
            return this.clef;
        } else {
            return this.initialClef;
        }
    }
}
