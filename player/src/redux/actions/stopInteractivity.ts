import { store } from "../store";
import { RootState } from "../../types";
import { startMIDI } from "../../util/midi_utils";
import { STOP_SEEK } from "../../constants";

export const stopInteractivity = () => {
  const state = store.getState() as RootState;
  const { wasPlaying, currentTrack, playheadMillis } = state;
  let track = currentTrack;
  if (wasPlaying) {
    track = startMIDI(track, playheadMillis);
  }
  return {
    type: STOP_SEEK,
    payload: {
      currentTrack: track,
    },
  };
};
