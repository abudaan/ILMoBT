import { store } from "../store";
import { RootState } from "../../types";
import { stopMIDI, startMIDI } from "../../util/midi_utils";
import { SELECT_TRACK } from "../../constants";

export const selectTrack = (index: number) => {
  const state = store.getState() as RootState;
  const { tracks, currentTrack } = state;
  stopMIDI(currentTrack);
  const track = startMIDI(tracks[index], 0);
  return {
    type: SELECT_TRACK,
    payload: {
      index,
      currentTrack: track,
    },
  };
};
