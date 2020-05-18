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

export const EditorGridCanvas = (): JSX.Element => {
  const dispatch = useDispatch();
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const width = useSelector((state: RootState) => state.width);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const numBars = useSelector((state: RootState) => state.numBars);
  const numNotes = useSelector((state: RootState) => state.numNotes);
  const numerator = useSelector((state: RootState) => state.numerator);
  const denominator = useSelector((state: RootState) => state.denominator);
  const columns = numBars * numerator * denominator; // beats
  const canvasWidth = width * zoomLevel + 1;
  const canvasHeight = 8 * 30 + 1;

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "#f7bd3e";
      ctx.translate(0.5, 0.5);
      // ctx.fillStyle = 'rgb(' + 100 + ',' + 99 + ',' + (event.velocity * 2) + ')'
      const w = (width * zoomLevel) / columns;
      for (let i = 0; i < columns; i++) {
        const thickness = i % 16 === 0 ? 1 : i % 4 === 0 ? 0.7 : 0.5;
        ctx.fillRect(Math.round(w * i), 0, thickness, 8 * 30);
      }
      const h = 30;
      for (let i = 1; i <= numNotes; i++) {
        ctx.fillRect(0, i * 30, width * zoomLevel, 0.7);
      }
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
