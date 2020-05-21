import { AnyAction } from "redux";
import { store } from "../store";
import {
  STOP_DRAW_NOTE,
  NO_ACTION_REQUIRED,
  STOP_MOVE_NOTE,
  STOP_RESIZE_NOTE,
  DRAW_NOTE,
  MOVE_NOTE,
  RESIZE_NOTE,
  MOVE_PLAYHEAD,
  STOP_MOVE_PLAYHEAD,
} from "../../constants";
import { RootState, Transport } from "../../types";
import { createMIDIEventsFromNotes } from "../../util/midi_utils";
import { SyntheticEvent } from "react";
import { clock, startMIDI } from "../../util/midi_utils";
import { setProgress } from "../../redux/actions/setProgress";

export const handlePointerUp = (e: SyntheticEvent): AnyAction => {
  const state = store.getState() as RootState;
  const { editAction, songData, notes, currentNote, wasPlaying, transport, playheadMillis } = state;

  console.log("Pointer", e.nativeEvent.type, editAction);

  if (!editAction) {
    return {
      type: NO_ACTION_REQUIRED,
    };
  } else if (editAction === MOVE_PLAYHEAD) {
    let t = transport;
    let sd = songData;
    if (wasPlaying) {
      t = Transport.PLAY;
      sd = startMIDI(songData, playheadMillis);
      clock.play(performance.now(), (progress: number) => {
        store.dispatch(setProgress(progress));
      });
    }
    return {
      type: STOP_MOVE_PLAYHEAD,
      payload: {
        transport: t,
      },
    };
  }

  const trackId = songData.song.tracks[0].id;
  const newNotes = [...notes, currentNote];
  const events = createMIDIEventsFromNotes(
    newNotes,
    songData.noteMapping,
    songData.millisPerTick,
    trackId,
    songData.velocity
  );
  // console.log(events);
  let type = "";
  if (editAction === DRAW_NOTE) {
    type = STOP_DRAW_NOTE;
  } else if (editAction === MOVE_NOTE) {
    type = STOP_MOVE_NOTE;
  } else if (editAction === RESIZE_NOTE) {
    type = STOP_RESIZE_NOTE;
  }

  // console.log(events);
  return {
    type,
    payload: {
      notes: newNotes,
      songData: {
        ...songData,
        song: {
          ...songData.song,
          events,
        },
      },
    },
  };
};
