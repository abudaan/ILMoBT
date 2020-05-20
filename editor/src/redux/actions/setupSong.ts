import { AnyAction } from "redux";
import { outputs } from "../../media";
import { Song } from "../../../../webdaw/types";
import { STORE_SONG } from "../../constants";

const ppq = 128;
const bpm = 120;
const numerator = 4;
const denominator = 4;
const numBars = 10;
const numNotes = 8; // number of notes used in this song
const noteMapping = [60, 62, 64, 65, 67, 69, 71, 72].reverse();

export const setupSong = (): AnyAction => {
  const millisPerTick = (60 / bpm / ppq) * 1000;

  const track = {
    id: "track-1",
    latency: 0,
    inputs: [],
    outputs: outputs.map(o => o.id),
  };

  const song = {
    ppq,
    latency: 17,
    bufferTime: 100,
    initialTempo: bpm,
    // numBars: numBars,
    numerator,
    denominator,
    durationTicks: numBars * numerator * (denominator / 4) * ppq,
    durationMillis: numBars * numerator * (denominator / 4) * ppq * millisPerTick,
    tracks: [track],
    tracksById: { [track.id]: track },
    events: [],
  } as Song;

  return {
    type: STORE_SONG,
    payload: {
      songData: {
        song,
        millisPerTick,
        timestamp: 0,
        millis: 0,
        index: 0,
        scheduled: [],
        numBars,
        numNotes,
        noteMapping,
      },
    },
  };
};
