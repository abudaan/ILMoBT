import React, { useRef, useEffect } from "react";
import uniquid from "uniquid";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RefMIDI } from "../types";
import { NoteOnEvent } from "../../../webdaw/midi_events";


export const Editor = (): JSX.Element => {
  const numBars = 20;
  const rows = 8;
  const columns = numBars * 4;

  const createGrid = () => {
    const rowDivs = [];
    for (let i = 0; i < rows; i++) {
      const columnDivs = [];
      for (let j = 0; j < columns; j++) {
        columnDivs.push(<div key={uniquid()} className="pr-column"></div>)
      }
      rowDivs.push(<div key={uniquid()} className="pr-row">{columnDivs}</div>)
    }
    return rowDivs;
  }

  return <div className="piano-roll">
    {createGrid()}
  </div>

};

/* <i className="fas fa-play fa-xs"></i> */