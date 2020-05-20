import { store } from "../store";
import { RootState } from "../../types";
import { PANIC } from "../../constants";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { clock } from "../../util/midi_utils";

export const handlePanic = () => {
  clock.stop();
  const state = store.getState() as RootState;
  const { songData } = state;
  unschedule(songData.song, midiAccess.outputs);
  return {
    type: PANIC,
  };
};
