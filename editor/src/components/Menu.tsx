import React, { RefObject, useRef, SyntheticEvent } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { setZoomLevel, seekZoomLevel, resetTimeline } from "../redux/actions/handleOther";
import { handleFileUpload } from "../redux/actions/handleFileUpload";
import { RootState } from "../types";
import { Slider } from "./Slider";
import { PositionDisplay } from "./PositionDisplay";

const Menu = (): JSX.Element => {
  const refs: { [id: string]: RefObject<HTMLInputElement> } = {
    video: useRef(),
    audio: useRef(),
    midi: useRef(),
  };
  const dispatch = useDispatch();
  const hasVideo = useSelector((state: RootState) => state.videoURL);
  const value = useSelector((state: RootState) => state.seekZoomLevel);

  const onClick = (type: string): void => {
    const ref = refs[type];
    if (ref.current) {
      ref.current.click();
      ref.current.value = "";
    }
  };

  return (
    <div className="menu">
      <input
        type="file"
        onChange={(e): void => {
          dispatch(handleFileUpload(e, "video"));
        }}
        multiple={false}
        className="upload-file"
        accept="video/*"
        ref={refs.video}
      />
      <button
        // disabled={!enabled}
        type="button"
        onClick={(): void => {
          onClick("video");
        }}
      >
        add video file
      </button>

      <input
        type="file"
        onChange={(e): void => {
          dispatch(handleFileUpload(e, "audio"));
        }}
        multiple={false}
        className="upload-file"
        accept="audio/*"
        ref={refs.audio}
      />
      <button
        disabled={!hasVideo}
        type="button"
        onClick={(): void => {
          onClick("audio");
        }}
      >
        add audio file
      </button>

      <input
        type="file"
        onChange={(e): void => {
          dispatch(handleFileUpload(e, "midi"));
        }}
        multiple={false}
        className="upload-file"
        accept=".mid, .midi, .json"
        ref={refs.midi}
      />
      <button
        disabled={!hasVideo}
        type="button"
        onClick={(): void => {
          onClick("midi");
        }}
      >
        add MIDI file
      </button>
      <Slider
        max={10}
        min={0.1}
        value={value}
        id="zoom-range"
        label="zoom"
        step={0.1}
        onChange={(e): void => {
          // console.log(e);
          const value = parseFloat((e.nativeEvent.target as HTMLInputElement).value);
          dispatch(seekZoomLevel(value));
        }}
        onInput={(e): void => {
          // console.log((e.nativeEvent.target as HTMLInputElement).value);
          const value = parseFloat((e.nativeEvent.target as HTMLInputElement).value);
          dispatch(setZoomLevel(value));
        }}
        disabled={false}
      ></Slider>
      <button
        disabled={!hasVideo}
        type="button"
        onClick={(): void => {
          dispatch(resetTimeline());
        }}
      >
        reset timeline
      </button>
    </div>
  );
};
export { Menu };
