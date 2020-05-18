import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { TransportControls } from "./TransportControls";
import { PositionDisplay } from "./PositionDisplay";
import { handlePointerMove } from "../redux/actions/handlePointer";
import { stopInteractivity } from "../redux/actions";
import { EditorGrid } from "./EditorGrid";
import { EditorGridCanvas } from "./EditorGridCanvas";
import { EditorGridFlexBox } from "./EditorGridFlexBox";
import { EditorNotes } from "./EditorNotes";
import { Scrollable } from "./Scrollable";
import { Menu } from "./Menu";
import { EditorCurrentNote } from "./EditorCurrentNote";

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
      <Menu></Menu>
      {/* <TransportControls></TransportControls> */}
      {/* <PositionDisplay></PositionDisplay> */}
      <Scrollable>
        {/* <EditorGridCanvas></EditorGridCanvas> */}
        <EditorGridFlexBox></EditorGridFlexBox>
        <EditorNotes></EditorNotes>
        <EditorCurrentNote></EditorCurrentNote>
      </Scrollable>
    </div>
  );
};
