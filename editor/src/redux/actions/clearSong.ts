import { store } from "../store";
import { RootState } from "../../types";
import { CLEAR_SONG } from "../../constants";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { clock } from "../../util/midi_utils";

export const clearSong = () => {
  clock.stop();
  const state = store.getState() as RootState;
  const { songData } = state;
  unschedule(songData.song, midiAccess.outputs);
  return {
    type: CLEAR_SONG,
    payload: {
      notes: [],
      songData: {
        ...songData,
        song: {
          ...songData.song,
          events: [],
        },
      },
    },
  };
};
