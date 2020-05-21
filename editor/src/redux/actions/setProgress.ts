import { store } from "../store";
import { RootState, Transport } from "../../types";
import { playMIDI, stopMIDI, pauseMIDI, clock } from "../../util/midi_utils";
import { SET_PROGRESS } from "../../constants";

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const { playheadMillis, songData, transport, width, editorScrollPos, zoomLevel } = state;
  const millis = playheadMillis + progress;
  const p = playheadMillis / songData.song.durationMillis;
  let scroll = editorScrollPos;
  let pixels = p * width * zoomLevel;
  scroll = Math.max(0, Math.ceil((pixels - width) / width) * width);
  scroll = Math.min(scroll, width * zoomLevel - width);
  // console.log(scroll);

  let sd = songData;
  if (millis < songData.song.durationMillis) {
    sd = playMIDI(songData);
    return {
      type: SET_PROGRESS,
      payload: {
        progress,
        transport,
        playheadMillis: millis,
        playheadPixels: pixels,
        editorScrollPos: scroll,
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
      playheadPixels: width * zoomLevel,
      editorScrollPos: scroll,
      isPlaying: false,
      songData: sd,
    },
  };
};
