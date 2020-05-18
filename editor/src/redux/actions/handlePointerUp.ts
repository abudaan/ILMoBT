import { SyntheticEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import { store } from "../store";
import { STOP_EDIT, STOP_DRAW_NOTE, NO_ACTION_REQUIRED, STOP_MOVE_NOTE } from "../../constants";
import { RootState } from "../../types";

export const handlePointerUp = (): AnyAction => {
  const state = store.getState() as RootState;
  const { editAction } = state;

  if (editAction === "drawNote") {
    return {
      type: STOP_DRAW_NOTE,
    };
  } else if (editAction === "moveNote") {
    return {
      type: STOP_MOVE_NOTE,
    };
  }

  return {
    type: NO_ACTION_REQUIRED,
  };
};
