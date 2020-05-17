import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RefMIDI } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";
import { handlePointerDown } from "../redux/actions/handlePointer";

export const EditorNotes = (): JSX.Element => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.notes);
  const width = useSelector((state: RootState) => state.width);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const ticksPerPixel = useSelector((state: RootState) => state.ticksPerPixel);
  // console.log(ticksPerPixel);

  const addNotes = () => {
    const noteDivs = notes.map(n => {
      const x = n.ticks * ticksPerPixel + 0.5;
      const y = (8 - n.noteNumber) * 30 + 9;
      const w = n.duration * ticksPerPixel;
      return (
        <div
          key={n.id}
          id={n.id}
          className="note"
          style={{ left: `${x}px`, top: `${y}px`, width: `${w}px` }}
        ></div>
      );
    });
    return noteDivs;
  };

  return (
    <div
      style={{ width: `${width * zoomLevel}px` }}
      className="piano-roll-notes"
      onPointerDown={(e): void => {
        dispatch(handlePointerDown(e));
      }}
    >
      {addNotes()}
    </div>
  );
};

/* <i className="fas fa-play fa-xs"></i> */
