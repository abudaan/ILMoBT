import { SyntheticEvent } from "react";
import { getNativeEvent, getClientPos } from "../../util/util";
import { store } from "../store";
import { RootState } from "../../types";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { START_SEEK } from "../../constants";

export const startSeek = (e: SyntheticEvent) => {
  const n = getNativeEvent(e);
  const x = getClientPos(n).x;
  const state = store.getState() as RootState;
  const { currentTrack, isPlaying } = state;
  unschedule(currentTrack.song, midiAccess.outputs);
  // console.log(x);
  return {
    type: START_SEEK,
    payload: {
      thumbX: x,
      wasPlaying: isPlaying,
    },
  };
};
