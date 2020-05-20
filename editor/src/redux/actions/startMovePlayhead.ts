import { AnyAction } from "redux";
import { START_MOVE_PLAYHEAD } from "../../constants";
import { SyntheticEvent } from "react";
import { clock, pauseMIDI } from "../../util/midi_utils";
import { store } from "../store";
import { RootState } from "../../types";

export const startMovePlayhead = (e: SyntheticEvent): AnyAction => {
  clock.stop();
  const state = store.getState() as RootState;
  const { songData } = state;
  const sd = pauseMIDI(songData);

  e.stopPropagation();
  return {
    type: START_MOVE_PLAYHEAD,
    payload: {
      songData: sd,
    },
  };
};
