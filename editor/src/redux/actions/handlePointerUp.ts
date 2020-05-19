import { SyntheticEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import { store } from "../store";
import {
  STOP_EDIT,
  STOP_DRAW_NOTE,
  NO_ACTION_REQUIRED,
  STOP_MOVE_NOTE,
  STOP_RESIZE_NOTE,
  DRAW_NOTE,
  MOVE_NOTE,
  RESIZE_NOTE,
} from "../../constants";
import { RootState } from "../../types";

export const handlePointerUp = (): AnyAction => {
  const state = store.getState() as RootState;
  const { editAction } = state;

  console.log("Pointer Up", editAction);

  if (editAction === DRAW_NOTE) {
    return {
      type: STOP_DRAW_NOTE,
    };
  } else if (editAction === MOVE_NOTE) {
    return {
      type: STOP_MOVE_NOTE,
    };
  } else if (editAction === RESIZE_NOTE) {
    return {
      type: STOP_RESIZE_NOTE,
    };
  }

  return {
    type: NO_ACTION_REQUIRED,
  };
};
