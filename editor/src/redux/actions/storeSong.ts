import { AnyAction } from "redux";
import { Song } from "../../../../webdaw/types";
import { STORE_SONG } from "../../constants";

export const storeSong = (song: Song): AnyAction => {
  return {
    type: STORE_SONG,
    payload: { song },
  };
};
