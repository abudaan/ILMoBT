import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { Slider } from "./Slider";
import { TransportControls } from "./TransportControls";
import { PositionDisplay } from "./PositionDisplay";
import { stopInteractivity, handlePointerMove } from "../redux/actions";
import { EditorGrid } from "./EditorGrid";
import { EditorGridCanvas } from "./EditorGridCanvas";
import { EditorGridFlexBox } from "./EditorGridFlexBox";
import { EditorNotes } from "./EditorNotes";
import { Scrollable } from "./Scrollable";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loading);

  if (loading) {
    return <div className="loading">LOADING...</div>;
  }
  const stop = () => {
    dispatch(stopInteractivity());
  };
  return (
    <div
    // onPointerUp={stop}
    // onPointerLeave={stop}
    // onPointerMove={(e): void => {
    //   dispatch(handlePointerMove(e));
    // }}
    >
      <TransportControls></TransportControls>
      {/* <PositionDisplay></PositionDisplay> */}
      <Scrollable>
        {/* <EditorGridCanvas></EditorGridCanvas> */}
        <EditorGridFlexBox></EditorGridFlexBox>
        <EditorNotes></EditorNotes>
      </Scrollable>
    </div>
  );
};
