import { store } from "../store";
import { RootState, Transport } from "../../types";
import { playMIDI, stopMIDI, pauseMIDI, clock } from "../../util/midi_utils";
import { SET_PROGRESS } from "../../constants";

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const { playheadMillis, songData, transport } = state;
  const millis = playheadMillis + progress;

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
  clock.stop();
  sd = pauseMIDI(songData);
  return {
    type: SET_PROGRESS,
    payload: {
      progress,
      transport: Transport.PAUSE,
      playheadMillis: songData.song.durationMillis,
      isPlaying: false,
      songData: sd,
    },
  };
};
