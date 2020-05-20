import { store } from "../store";
import { RootState } from "../../types";
import { SAVE_MIDI_FILE, SEND_TO_FRIEND } from "../../constants";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { clock } from "../../util/midi_utils";

export const sendToFriend = () => {
  clock.stop();
  const state = store.getState() as RootState;
  const { songData } = state;
  unschedule(songData.song, midiAccess.outputs);
  return {
    type: SEND_TO_FRIEND,
  };
};
