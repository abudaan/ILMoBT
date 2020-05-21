import { AnyAction } from "redux";
import { SCROLL_EDITOR } from "../../constants";
import { store } from "../store";
import { RootState } from "../../types";
import { NO_ACTION_REQUIRED } from "../../constants";

export const scrollEditor = (scrollLeft: number): AnyAction => {
  const state = store.getState() as RootState;
  const { editorScrollPos } = state;
  if (scrollLeft === editorScrollPos) {
    return {
      type: NO_ACTION_REQUIRED,
    };
  }
  return {
    type: SCROLL_EDITOR,
    payload: { scrollLeft },
  };
};
