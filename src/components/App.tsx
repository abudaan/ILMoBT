import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import { handlePointerDown } from "../redux/actions/handlePointer";
import { RootState } from "../types";
import { List } from "./List";
import { Slider } from "./Slider";
import { TransportControls } from "./TransportControls";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loading);
  const sliderProps = useSelector((state: RootState) => state.sliderProps);

  if(loading) {
      return <div className='loading'>LOADING...</div>
  }

  return (<>
    <List></List>
    <TransportControls></TransportControls>
    <Slider {...sliderProps}></Slider>
    </>);
}
