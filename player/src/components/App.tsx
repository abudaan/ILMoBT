import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { List } from "./List";
import { Slider } from "./Slider";
import { TransportControls } from "./TransportControls";
import { PositionDisplay } from "./PositionDisplay";
import { stopInteractivity } from "../redux/actions/stopInteractivity";
import { handlePointerMove } from "../redux/actions/handlePointerMove";
import { PianoRollPreview } from "./PianoRollPreview";
import { Message } from "./Message";

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
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerMove={(e): void => {
        dispatch(handlePointerMove(e));
      }}
    >
      <List></List>
      <Message></Message>
      <PositionDisplay></PositionDisplay>
      <Slider></Slider>
      <TransportControls></TransportControls>
      {/* <div className="overlay"></div> */}
      {/* <PianoRollPreview></PianoRollPreview> */}
    </div>
  );
};
