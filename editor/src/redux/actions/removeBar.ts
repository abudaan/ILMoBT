import { REMOVE_BAR } from "../../constants";
import { AnyAction } from "redux";
import { RootState } from "../../types";
import { store } from "../store";
import { createMIDIEventsFromNotes } from "../../util/midi_utils";

export const removeBar = (): AnyAction => {
  const state = store.getState() as RootState;
  const { width, zoomLevel, songData, notes } = state;

  const {
    numBars,
    noteMapping,
    millisPerTick,
    song: { tracks, numerator, denominator, ppq },
  } = songData;

  const ticksPerPixel = (width * zoomLevel) / ((numBars - 1) * numerator * denominator * ppq);
  const maxTicks = (numBars - 1) * numerator * denominator * ppq;
  const filteredNotes = notes.filter(note => {
    // console.log(maxTicks, note.ticks, note.duration);
    if (note.ticks > maxTicks) {
      return false;
    } else if (note.ticks + note.duration > maxTicks) {
      return false;
    }
    return true;
  });
  const filteredEvents = createMIDIEventsFromNotes(
    notes,
    noteMapping,
    millisPerTick,
    tracks[0].id,
    songData.velocity
  );

  return {
    type: REMOVE_BAR,
    payload: {
      ticksPerPixel,
      notes: filteredNotes,
      songData: {
        ...songData,
        numBars: numBars - 1,
        song: {
          ...songData.song,
          events: filteredEvents,
          notes: filteredNotes,
          durationTicks: numBars * numerator * (denominator / 4) * ppq,
          durationMillis: numBars * numerator * (denominator / 4) * ppq * millisPerTick,
        },
      },
    },
  };
};
