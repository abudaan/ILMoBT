import { store } from "../store";
import { RootState } from "../../types";
import { SAVE_MIDI_FILE } from "../../constants";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { clock, getMIDIFile } from "../../util/midi_utils";

export const saveMIDIFile = () => {
  clock.stop();
  const state = store.getState() as RootState;
  const { songData, notes } = state;
  unschedule(songData.song, midiAccess.outputs);

  const { noteMapping } = songData;
  const url = getMIDIFile(songData, notes, noteMapping);
  const a: HTMLAnchorElement = document.createElement("A") as HTMLAnchorElement;
  a.href = url;
  a.download = "touch.mid";
  a.click();
  window.URL.revokeObjectURL(url); // cleanup

  return {
    type: SAVE_MIDI_FILE,
  };
};
