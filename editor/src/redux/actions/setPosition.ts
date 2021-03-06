import { SyntheticEvent } from "react";
import { store } from "../store";
import { RootState } from "../../types";
import { NO_ACTION_REQUIRED, SET_POSITION } from "../../constants";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { getNativeEvent, getOffset } from "../../util/util";
import { startMIDI } from "../../util/midi_utils";

export const setPosition = (e: SyntheticEvent) => {
  const state = store.getState() as RootState;
  const { songData, width } = state;
  const id = (e.target as HTMLDivElement).id;
  if (id !== "slider") {
    return {
      type: NO_ACTION_REQUIRED,
    };
  }
  unschedule(songData.song, midiAccess.outputs);
  const n = getNativeEvent(e);
  const x = getOffset(n).x;
  const millis = Math.max(0, (x / width) * songData.song.durationMillis);
  const track = startMIDI(songData, millis);

  return {
    type: SET_POSITION,
    payload: {
      playheadMillis: millis,
      playheadPixels: x,
      currentTrack: track,
    },
  };
};
