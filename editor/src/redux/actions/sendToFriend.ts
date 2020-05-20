import { store } from "../store";
import { RootState } from "../../types";
import { SEND_TO_FRIEND, SAVE_MIDI_FILE, PANIC } from "../../constants";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { clock, getMIDIFile } from "../../util/midi_utils";

export const sendToFriend = () => {
  clock.stop();
  const state = store.getState() as RootState;
  const { songData, notes } = state;
  const { noteMapping } = songData;
  unschedule(songData.song, midiAccess.outputs);
  const base64 = getMIDIFile(songData, notes, noteMapping, "base64");
  // console.log(base64);
  return {
    type: SEND_TO_FRIEND,
  };
};
