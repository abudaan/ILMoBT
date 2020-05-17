import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RefMIDI } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";
import { handlePointerDown } from "../redux/actions/handlePointer";

export const EditorNotes = (): JSX.Element => {
  const dispatch = useDispatch();
  const width = useSelector((state: RootState) => state.width);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const notes = useSelector((state: RootState) => state.notes);
  const durationTimeline = useSelector((state: RootState) => state.durationTimeline);
  const numBars = useSelector((state: RootState) => state.numBars);
  const numerator = useSelector((state: RootState) => state.numerator);
  const denominator = useSelector((state: RootState) => state.denominator);
  const ppq = useSelector((state: RootState) => state.ppq);
  const ticksPerPixel = (width * zoomLevel) / (numBars * numerator * denominator * ppq);

  const addNotes = () => {
    const noteDivs = notes.map(n => {
      const x = n.ticks * ticksPerPixel;
      const w = n.duration * ticksPerPixel;
      const y = (8 - n.noteNumber) * 30;
      return (
        <div
          key={n.id}
          id={n.id}
          className="note"
          style={{ left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${30}px` }}
        ></div>
      );
    });
    return noteDivs;
  };

  return (
    <div style={{ width: `${width * zoomLevel}px` }} className="piano-roll-notes">
      {addNotes()}
    </div>
  );
};

/* <i className="fas fa-play fa-xs"></i> */
