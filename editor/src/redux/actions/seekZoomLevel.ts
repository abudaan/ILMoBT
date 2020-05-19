import { AnyAction } from "redux";
import { SEEK_ZOOM_LEVEL } from "../../constants";

export const seekZoomLevel = (zoom: number): AnyAction => {
  return {
    type: SEEK_ZOOM_LEVEL,
    payload: { zoom },
  };
};
