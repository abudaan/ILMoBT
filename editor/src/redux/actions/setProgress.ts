import { store } from "../store";
import { RootState, Transport } from "../../types";
import { playMIDI, stopMIDI } from "./action_utils";
import { SET_PROGRESS } from "../../constants";

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const { playheadMillis, songData, transport } = state;
  const millis = playheadMillis + progress;

  // console.log(millis);
  let sd = songData;
  if (millis < songData.song.durationMillis) {
    sd = playMIDI(songData);
    return {
      type: SET_PROGRESS,
      payload: {
        progress,
        transport,
        playheadMillis: millis,
        isPlaying: true,
        songData: sd,
      },
    };
  }
  sd = stopMIDI(songData);
  return {
    type: SET_PROGRESS,
    payload: {
      progress,
      transport: Transport.STOP,
      playheadMillis: 0,
      isPlaying: false,
      songData: sd,
    },
  };
};
