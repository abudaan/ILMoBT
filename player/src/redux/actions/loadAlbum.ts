import { Dispatch } from "redux";
import { fetchJSON, fetchArraybuffer } from "../../../../webdaw/fetch_helpers";
import { RefMIDI } from "../../types";
import { createSongFromMIDIFile } from "../../../../webdaw/sugar_coating";
import { outputs } from "../../media";
import { ALBUM_LOADED } from "../../constants";

export const loadAlbum = (url: string) => async (dispatch: Dispatch): Promise<void> => {
  const d = await fetchJSON(url);
  const v = Object.values(d);
  const r = await Promise.all(v.map(ld => fetchArraybuffer(ld.url)));
  const t = await Promise.all(
    r.map(
      async (ab, i: number): Promise<RefMIDI> => {
        const song = await createSongFromMIDIFile(ab);
        const duration = song.events[song.events.length - 1].millis;
        // console.log(song.events);
        song.tracks.forEach(track => {
          track.outputs.push(...outputs.map(o => o.id));
        });
        const reference: RefMIDI = {
          id: `song-${i}`,
          title: v[i].title,
          song,
          timestamp: 0,
          millis: 0,
          index: 0,
          scheduled: [],
          duration,
        };
        return reference;
      }
    )
  );

  dispatch({
    type: ALBUM_LOADED,
    payload: {
      tracks: t,
    },
  });
};
