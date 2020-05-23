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

  const numBars1 = numBars + 1;
  const durationTicks = numBars1 * numerator * (denominator / 4) * ppq;
  const durationMillis = durationTicks * millisPerTick;
  const ticksPerPixel = (width * zoomLevel) / durationTicks;
  const millisPerPixel = (width * zoomLevel) / durationMillis;

  return {
    type: ADD_BAR,
    payload: {
      ticksPerPixel,
      millisPerPixel,
      songData: {
        ...songData,
        numBars: numBars1,
        song: {
          ...songData.song,
          durationTicks,
          durationMillis,
        },
      },
    },
  };
};
