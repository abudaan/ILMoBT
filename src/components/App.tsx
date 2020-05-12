import React, { SyntheticEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";
import { List } from "./List";
import { Slider } from "./Slider";
import { TransportControls } from "./TransportControls";

export const App = (): JSX.Element => {
  const loading = useSelector((state: RootState) => state.loading);
  const sliderProps = {
    max: 1,
    min: 0,
    value: 0,
    id: `slider-${Date.now()}`,
    label: "",
    step: 0.001,
    type: "song-position",
    disabled: false,
  }
  
  if (loading) {
    return <div className='loading'>LOADING...</div>
  }

  return (<>
    <List></List>
    <TransportControls></TransportControls>
    <Slider {...sliderProps}></Slider>
  </>);
}
