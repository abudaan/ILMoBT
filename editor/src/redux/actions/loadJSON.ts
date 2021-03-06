import { Dispatch } from "redux";
import { fetchJSON } from "../../../../webdaw/fetch_helpers";
import { JSON_LOADED } from "../../constants";
import { ConfigData, RootState } from "../../types";
import { outputs } from "../../media";
import { Song } from "../../../../webdaw/types";
import { store } from "../store";

export const loadJSON = (url: string) => async (dispatch: Dispatch): Promise<void> => {
  const {
    ppq,
    bpm,
    velocity,
    numerator,
    denominator,
    numBars,
    numNotes,
    noteMapping,
  } = ((await fetchJSON(url)) as unknown) as ConfigData;

  const millisPerTick = (60 / bpm / ppq) * 1000;
  const track = {
    id: "track-1",
    latency: 0,
    inputs: [],
    outputs: outputs.map(o => o.id),
  };

  const durationTicks = numBars * numerator * (denominator / 4) * ppq;
  const durationMillis = durationTicks * millisPerTick;

  const state = store.getState() as RootState;
  const { width } = state;
  const ticksPerPixel = width / durationTicks;
  const millisPerPixel = width / durationMillis;

  const song = {
    ppq,
    latency: 17,
    bufferTime: 100,
    initialTempo: bpm,
    // numBars: numBars,
    numerator,
    denominator,
    durationTicks,
    durationMillis,
    tracks: [track],
    tracksById: { [track.id]: track },
    events: [],
  } as Song;

  dispatch({
    type: JSON_LOADED,
    payload: {
      songData: {
        song,
        velocity,
        millisPerTick,
        timestamp: 0,
        millis: 0,
        index: 0,
        scheduled: [],
        numBars,
        numNotes,
        noteMapping: noteMapping.reverse(),
      },
      ticksPerPixel,
      millisPerPixel,
    },
  });
};
