import { store } from "../store";
import { RootState, Transport } from "../../types";
import { playMIDI, stopMIDI } from "./action_utils";
import { SET_PROGRESS, NO_ACTION_REQUIRED } from "../../constants";

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const { playheadMillis, currentTrack, transport } = state;
  const millis = playheadMillis + progress;

  console.log(millis);
  return {
    type: NO_ACTION_REQUIRED,
  };

  let track = currentTrack;
  if (currentTrack !== null && millis < currentTrack.duration) {
    track = playMIDI(track);
    return {
      type: SET_PROGRESS,
      payload: {
        progress,
        transport,
        playheadMillis: millis,
        isPlaying: true,
        // currentTrack: track,
      },
    };
  }
  track = stopMIDI(track);
  return {
    type: SET_PROGRESS,
    payload: {
      progress,
      transport: Transport.STOP,
      playheadMillis: 0,
      isPlaying: false,
      // currentTrack: track,
    },
  };
};
