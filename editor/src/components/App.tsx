import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { Playhead } from "./Playhead";
import { handlePointerMove } from "../redux/actions/handlePointerMove";
import { handlePointerUp } from "../redux/actions/handlePointerUp";
import { EditorGridFlexBox } from "./EditorGridFlexBox";
import { EditorNotes } from "./EditorNotes";
import { Scrollable } from "./Scrollable";
import { Menu } from "./Menu";
import { Debug } from "./Debug";
import { EditorCurrentNote } from "./EditorCurrentNote";
import { PositionDisplay } from "./PositionDisplay";
import { Form } from "./Form";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loading);

  if (loading) {
    return <div className="loading">LOADING...</div>;
  }
  const stop = (e: React.SyntheticEvent<Element, Event>) => {
    dispatch(handlePointerUp(e));
  };
  return (
    <div
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerMove={(e): void => {
        dispatch(handlePointerMove(e));
      }}
    >
      <Menu></Menu>
      <PositionDisplay></PositionDisplay>
      <Scrollable>
        {/* <EditorGridCanvas></EditorGridCanvas> */}
        <EditorGridFlexBox></EditorGridFlexBox>
        <EditorNotes></EditorNotes>
        <EditorCurrentNote></EditorCurrentNote>
        <Playhead></Playhead>
      </Scrollable>
      <Form></Form>
      <Debug></Debug>
    </div>
  );
};
