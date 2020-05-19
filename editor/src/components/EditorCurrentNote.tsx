import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";
import { RESIZE_NOTE } from "../constants";

export const EditorCurrentNote = (): JSX.Element => {
  const currentNote = useSelector((state: RootState) => state.currentNote);
  const width = useSelector((state: RootState) => state.width);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const ticksPerPixel = useSelector((state: RootState) => state.ticksPerPixel);
  const noteHeight = useSelector((state: RootState) => state.noteHeight);
  const editAction = useSelector((state: RootState) => state.editAction);

  if (currentNote === null) {
    return null;
  }

  // console.log(currentNote);
  const x = currentNote.ticks * ticksPerPixel;
  const y = currentNote.noteNumber * noteHeight + noteHeight / 4;
  const w = currentNote.duration * ticksPerPixel;
  const style = {
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    cursor: `${editAction === RESIZE_NOTE ? "w-resize" : "pointer"}`,
  };

  return (
    <div
      style={{
        width: `${width * zoomLevel}px`,
      }}
      className="piano-roll-current-note"
    >
      <div id={currentNote.id} key={currentNote.id} style={style} className="note"></div>
    </div>
  );
};
