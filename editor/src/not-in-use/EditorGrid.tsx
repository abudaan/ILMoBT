import React, { useRef, useEffect, RefObject } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RefMIDI } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";
import { handlePointerDown } from "../redux/actions/handlePointer";

const createGrid = (numNotes: number, columns: number, width: number, zoomLevel: number) => {
  const rowDivs = [];
  const cellStyle = { width: `${(width * zoomLevel) / columns}px` };
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

const createGrid2 = (
  ctx: CanvasRenderingContext2D,
  numNotes: number,
  columns: number,
  width: number
) => {
  ctx.fillStyle = "#f7bd3e";
  ctx.translate(0.5, 0.5);
  // ctx.fillStyle = 'rgb(' + 100 + ',' + 99 + ',' + (event.velocity * 2) + ')'
  const w = width / columns;
  for (let i = 1; i < columns; i++) {
    ctx.fillRect(w * i, 0, 1, 8 * 30);
  }
};

export const EditorGrid = (): JSX.Element => {
  const dispatch = useDispatch();
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const width = useSelector((state: RootState) => state.width);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const numBars = useSelector((state: RootState) => state.numBars);
  const numNotes = useSelector((state: RootState) => state.numNotes);
  const numerator = useSelector((state: RootState) => state.numerator);
  const denominator = useSelector((state: RootState) => state.denominator);
  const columns = numBars * numerator * denominator; // beats
  const canvasWidth = width * zoomLevel;
  const canvasHeight = 8 * 30;

  useEffect(() => {
    if (canvasRef.current) {
      createGrid2(canvasRef.current.getContext("2d"), numNotes, columns, canvasWidth);
    }
  });

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
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
    </div>
  );
};
