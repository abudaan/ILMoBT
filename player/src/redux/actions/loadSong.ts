import { Dispatch } from "redux";
import { fetchJSON, fetchArraybuffer } from "../../../../webdaw/fetch_helpers";
import { parseMidiFile } from "../../../../webdaw/parse_midi_binary";
import { RefMIDI } from "../../types";
import { createSongFromMIDIFile } from "../../../../webdaw/sugar_coating";
import { outputs } from "../../media";
import { ALBUM_LOADED, SONG_LOADED } from "../../constants";
import { convertDataURIToBinary } from "../../util/util";
import { decode } from "../../util/base64-arraybuffer";

export const loadSong = (url: string) => async (dispatch: Dispatch): Promise<void> => {
  const d = await fetchJSON(url);
  console.log(d["song"]);
  const ab = decode(d["song"]);
  const midi = parseMidiFile(ab);
  console.log(midi);

  dispatch({
    type: SONG_LOADED,
    payload: {
      // tracks: t,
    },
  });
};
