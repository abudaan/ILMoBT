import { AnyAction } from "redux";
import { SCROLL_EDITOR } from "../../constants";

export const scrollEditor = (scrollLeft: number): AnyAction => {
  return {
    type: SCROLL_EDITOR,
    payload: { scrollLeft },
  };
};
