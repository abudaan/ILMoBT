import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RefMIDI } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";
import { handlePointerDown } from "../redux/actions/handlePointer";

export const EditorCurrentNote = (): JSX.Element => {
  const dispatch = useDispatch();
  const currentNote = useSelector((state: RootState) => state.currentNote);
  const width = useSelector((state: RootState) => state.width);
  const numNotes = useSelector((state: RootState) => state.numNotes);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const ticksPerPixel = useSelector((state: RootState) => state.ticksPerPixel);
  const noteHeight = useSelector((state: RootState) => state.noteHeight);

  if (currentNote === null) {
    return null;
  }

  console.log(currentNote);
  const x = currentNote.ticks * ticksPerPixel;
  const y = currentNote.noteNumber * noteHeight - noteHeight / 4;
  const w = currentNote.duration * ticksPerPixel;
  const style = { left: `${x}px`, top: `${y}px`, width: `${w}px` };

  return (
    <div
      style={{ width: `${width * zoomLevel}px` }}
      className="piano-roll-current-note"
      // onPointerDown={(e): void => {
      //   dispatch(handlePointerDown(e));
      // }}
    >
      <div id={currentNote.id} style={style} className="note"></div>
    </div>
  );
};

/* <i className="fas fa-play fa-xs"></i> */
