import { Dispatch } from "redux";
import { fetchJSON, fetchArraybuffer } from "../../../../webdaw/fetch_helpers";
import { parseMidiFile } from "../../../../webdaw/parse_midi_binary";
import { RefMIDI } from "../../types";
import { createSongFromMIDIFile } from "../../../../webdaw/sugar_coating";
import { outputs } from "../../media";
import { SONG_LOADED } from "../../constants";
import { decode } from "base64-arraybuffer";

// http://localhost:9000/?id=5ec7cb64548d9

export const loadSong = (url: string) => async (dispatch: Dispatch): Promise<void> => {
  const d = await fetchJSON(url);
  const ab = decode(d["song"]);

  const song = await createSongFromMIDIFile(ab);
  const duration = song.events[song.events.length - 1].millis;
  // console.log(song.events);
  song.tracks.forEach(track => {
    track.outputs.push(...outputs.map(o => o.id));
  });
  const reference: RefMIDI = {
    id: "song-0",
    title: "song-0",
    song,
    timestamp: 0,
    millis: 0,
    index: 0,
    scheduled: [],
    duration,
  };

  dispatch({
    type: SONG_LOADED,
    payload: {
      tracks: [reference],
      ...d,
    },
  });
};
