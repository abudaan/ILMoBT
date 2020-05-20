import { store } from "../store";
import { RootState } from "../../types";
import { SAVE_MIDI_FILE } from "../../constants";
import { unschedule } from "../../../../webdaw/unschedule";
import { getNoteName } from "../../../../webdaw/getNoteName";
import { midiAccess } from "../../media";
import { clock } from "../../util/midi_utils";
import MidiWriter from "midi-writer-js";

export const saveMIDIFile = () => {
  clock.stop();
  const state = store.getState() as RootState;
  const { songData, notes } = state;
  unschedule(songData.song, midiAccess.outputs);

  const { noteMapping } = songData;
  const events = notes.map(n => {
    const t = getNoteName(noteMapping[n.noteNumber]);
    const noteName = `${t[0]}${t[1]}`;
    console.log(n.ticks, noteName, n.duration);
    return new MidiWriter.NoteEvent({
      startTick: n.ticks,
      pitch: [noteName],
      duration: `T${n.duration}`,
    });
  });

  const track = new MidiWriter.Track();
  // track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
  track.setTimeSignature(songData.song.numerator, songData.song.denominator);
  track.setTempo(songData.song.initialTempo);
  track.addEvent(events, () => ({ sequential: true }));

  // Generate a data URI
  const write = new MidiWriter.Writer(track);
  const url = write.dataUri();
  const a: HTMLLinkElement = document.createElement("A") as HTMLLinkElement;
  a.href = url;
  a["download"] = "touch";
  a.click();
  window.URL.revokeObjectURL(url); // cleanup

  return {
    type: SAVE_MIDI_FILE,
  };
};
