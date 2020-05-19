import { AnyAction } from "redux";
import { START_MOVE_PLAYHEAD } from "../../constants";
import { SyntheticEvent } from "react";

export const startMovePlayhead = (e: SyntheticEvent): AnyAction => {
  return {
    type: START_MOVE_PLAYHEAD,
  };
};
