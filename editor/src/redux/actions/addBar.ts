import { ADD_BAR } from "../../constants";
import { AnyAction } from "redux";
import { store } from "../store";
import { RootState } from "../../types";

export const addBar = (): AnyAction => {
  const state = store.getState() as RootState;
  const {
    width,
    zoomLevel,
    songData: {
      song: { numerator, denominator, ppq, numBars },
    },
  } = state;
  const ticksPerPixel = (width * zoomLevel) / ((numBars + 1) * numerator * denominator * ppq);

  return {
    type: ADD_BAR,
    payload: {
      ticksPerPixel,
      numBars: numBars + 1,
    },
  };
};
