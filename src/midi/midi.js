import {NoteGuess} from "../guesser/note_guess";
import {Note} from "../notes/note"

export class MidiHandler {

  midi = null; // global MIDIAccess object

  //  @type {Game}
  game = null;

  constructor(game) {
    this.game = game;
    navigator.requestMIDIAccess()
      .then((midiAccess) => {
        console.log("MIDI ready!");
        this.midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
        this.listInputsAndOutputs(midiAccess);

        this.startLoggingMIDIInput();
      })
      .catch((error) => {
        console.error(`Failed to get MIDI access: `, error);
      })
  }

  listInputsAndOutputs(midiAccess) {
    for (const entry of midiAccess.inputs) {
      const input = entry[1];
      console.log(
        `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`,
      );
    }

    for (const entry of midiAccess.outputs) {
      const output = entry[1];
      console.log(
        `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
      );
    }
  }


  onMIDIMessage = (event) => {
    let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
    for (const character of event.data) {
      str += `0x${character.toString(16)} `;
    }
    const data = new Uint8Array(event.data.buffer);
    let offset = event.data.byteOffset;
    const count = event.data.length;
    // byte[] data, int offset, int count, long timestamp
    for (let i = 0; i < count; i++) {
      let currentByte = data[offset] & 0xFF;

      console.log("Note On: ", this.format(data[offset]));
      console.log("Note Value: ", data[offset + 1]);
      console.log("Velocity: ", data[offset + 2]);

      if (currentByte >= 0x90 && currentByte < 0xA0) {
        this.game.guessNote(new Note(data[offset + 1]), false);
        break;
      }

      if(currentByte >= 0x80 && currentByte < 0x90){
        this.game.stopGuessNote(new Note(data[offset+1]));
        break;
      }
      ++offset;
    }
  }

  startLoggingMIDIInput() {
    for (let [key, midiInput] of this.midi.inputs) {
      if (midiInput.name.includes('Arturia') && midiInput.type === 'input') {
        midiInput.onmidimessage = this.onMIDIMessage;
        break;
      }
    }
  }

  format(b) {
    return '0x' + ('0' + (b & 0xFF).toString(16)).slice(-2).toUpperCase();
  }

}