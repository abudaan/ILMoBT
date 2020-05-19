import { store } from "../store";
import { RootState } from "../../types";
import { STOP_SEEK } from "../../constants";
import { startMIDI } from "./action_utils";

export const stopInteractivity = () => {
  const state = store.getState() as RootState;
  const { wasPlaying, songData, playheadMillis } = state;
  let track = songData;
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
