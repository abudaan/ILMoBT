import { SyntheticEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import { store } from "../store";
import { STOP_EDIT, STOP_DRAW_NOTE } from "../../constants";
import { RootState } from "../../types";

export const handlePointerUp = (): AnyAction => {
  const state = store.getState() as RootState;
  const { editAction } = state;

  if (editAction === "drawNote") {
    return {
      type: STOP_DRAW_NOTE,
    };
  }
};
