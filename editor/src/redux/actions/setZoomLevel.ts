import { AnyAction } from "redux";
import { ZOOM_LEVEL } from "../../constants";
import { store } from "../store";
import { RootState } from "../../types";

export const setZoomLevel = (zoom: number): AnyAction => {
  const state = store.getState() as RootState;
  const {
    width,
    songData: {
      song: { durationTicks },
    },
  } = state;
  const ticksPerPixel = (width * zoom) / durationTicks;
  return {
    type: ZOOM_LEVEL,
    payload: {
      ticksPerPixel,
      zoomLevel: zoom,
    },
  };
};
