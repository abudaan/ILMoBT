import React, { useRef, useEffect, RefObject } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, SongData } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";
import { startDrawNote } from "../redux/actions/startDrawNote";

export const EditorGridFlexBox = (): JSX.Element => {
  const dispatch = useDispatch();
  const width = useSelector((state: RootState) => state.width);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const numBars = useSelector((state: RootState) => state.numBars);
  const numNotes = useSelector((state: RootState) => state.numNotes);
  const numerator = useSelector((state: RootState) => state.songData.song.numerator);
  const denominator = useSelector((state: RootState) => state.songData.song.denominator);
  const noteHeight = useSelector((state: RootState) => state.noteHeight);
  const columns = numBars * numerator * denominator; // beats

  const createRows = () => {
    const rowDivs = [];
    for (let i = 0; i < numNotes; i++) {
      rowDivs.push(
        <div
          id={`row-${i}`}
          key={`row-${i}`}
          style={{ flex: `0 0 ${noteHeight}px` }}
          className="pr-row"
        ></div>
      );
    }
    return rowDivs;
  };

  const createColumns = () => {
    const columnDivs = [];
    const style = { flex: `0 0 ${(width * zoomLevel) / columns}px` };
    for (let i = 0; i < columns; i++) {
      columnDivs.push(<div key={`column-${i}`} style={style} className="pr-column"></div>);
    }
    return columnDivs;
  };

  const style = { width: `${width * zoomLevel}px`, height: `${numNotes * noteHeight}px` };

  return (
    <div
      onPointerDown={(e): void => {
        dispatch(startDrawNote(e));
      }}
    >
      <div style={style} className="piano-roll-grid columns">
        {createColumns()}
      </div>
      <div style={style} className="piano-roll-grid rows">
        {createRows()}
      </div>
    </div>
  );
};
