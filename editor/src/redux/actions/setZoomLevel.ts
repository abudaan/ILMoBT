import { AnyAction } from "redux";
import { ZOOM_LEVEL } from "../../constants";

export const setZoomLevel = (zoom: number): AnyAction => {
  return {
    type: ZOOM_LEVEL,
    payload: { zoomLevel: zoom },
  };
};
