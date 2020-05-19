import { REMOVE_BAR } from "../../constants";
import { AnyAction } from "redux";
import { RootState } from "../../types";
import { store } from "../store";
import { createMIDIEventsFromNotes } from "./action_utils";

export const removeBar = (): AnyAction => {
  const state = store.getState() as RootState;
  const { width, zoomLevel, songData, notes } = state;

  const {
    millisPerTick,
    song: { tracks, numBars, numerator, denominator, ppq },
  } = songData;

  const ticksPerPixel = (width * zoomLevel) / ((numBars - 1) * numerator * denominator * ppq);
  const maxTicks = numBars * numerator * denominator * ppq;
  const filteredNotes = notes.filter(note => {
    if (note.ticks > maxTicks) {
      return false;
    } else if (note.ticks + note.duration > maxTicks) {
      return false;
    }
    return true;
  });
  const filteredEvents = createMIDIEventsFromNotes(notes, millisPerTick, tracks[0].id);

  return {
    type: REMOVE_BAR,
    payload: {
      ticksPerPixel,
      numBars: numBars - 1,
      songData: {
        ...songData,
        song: {
          ...songData.song,
          events: filteredEvents,
          notes: filteredNotes,
        },
      },
    },
  };
};
