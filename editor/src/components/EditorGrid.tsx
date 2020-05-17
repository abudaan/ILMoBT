import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RefMIDI } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";
import { handlePointerDown } from "../redux/actions/handlePointer";

export const EditorGrid = (): JSX.Element => {
  const dispatch = useDispatch();
  const width = useSelector((state: RootState) => state.width);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const numBars = useSelector((state: RootState) => state.numBars);
  const numNotes = useSelector((state: RootState) => state.numNotes);
  const numerator = useSelector((state: RootState) => state.numerator);
  const denominator = useSelector((state: RootState) => state.denominator);
  const columns = numBars * numerator * denominator; // beats
  const cellStyle = { width: `${(width * zoomLevel) / columns}px` };

  const createGrid = () => {
    const rowDivs = [];
    for (let i = 0; i < numNotes; i++) {
      const columnDivs = [];
      for (let j = 0; j < columns; j++) {
        columnDivs.push(<div key={`column-${j}`} style={cellStyle} className="pr-column"></div>);
      }
      rowDivs.push(
        <div key={`row-${i}`} className="pr-row">
          {columnDivs}
        </div>
      );
    }
    return rowDivs;
  };

  return (
    <div
      // onPointerMove={(e): void => {
      //   dispatch(handlePointerMove(e));
      // }}
      onPointerDown={(e): void => {
        dispatch(handlePointerDown(e));
      }}
      style={{ width: `${width * zoomLevel}px` }}
      className="piano-roll"
    >
      {createGrid()}
    </div>
  );
};

/* <i className="fas fa-play fa-xs"></i> */
