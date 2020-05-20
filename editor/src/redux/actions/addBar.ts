import { ADD_BAR } from "../../constants";
import { AnyAction } from "redux";
import { store } from "../store";
import { RootState } from "../../types";

export const addBar = (): AnyAction => {
  const state = store.getState() as RootState;
  const { width, zoomLevel, songData } = state;
  const {
    numBars,
    millisPerTick,
    song: { numerator, denominator, ppq },
  } = songData;
  const ticksPerPixel = (width * zoomLevel) / ((numBars + 1) * numerator * denominator * ppq);

  return {
    type: ADD_BAR,
    payload: {
      ticksPerPixel,
      songData: {
        ...songData,
        numBars: numBars - 1,
        song: {
          ...songData.song,
          durationTicks: numBars * numerator * (denominator / 4) * ppq,
          durationMillis: numBars * numerator * (denominator / 4) * ppq * millisPerTick,
        },
      },
    },
  };
};
