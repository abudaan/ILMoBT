import { AnyAction } from "redux";
import { SCROLL_ARRANGER } from "../../constants";

export const scrollArranger = (scroll: number): AnyAction => {
  return {
    type: SCROLL_ARRANGER,
    payload: { scroll },
  };
};
