import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RootState, Transport } from "../types";
import { SliderRange } from "./SliderRange";
import { handleTransport } from "../redux/actions/handleTransport";
import { addBar } from "../redux/actions/addBar";
import { removeBar } from "../redux/actions/removeBar";
import { seekZoomLevel } from "../redux/actions/seekZoomLevel";
import { setZoomLevel } from "../redux/actions/setZoomLevel";
import { handlePanic } from "../redux/actions/handlePanic";
import { clearSong } from "../redux/actions/clearSong";
import { saveMIDIFile } from "../redux/actions/saveMIDIFile";
import { sendToFriend } from "../redux/actions/sendToFriend";

const Menu = (): JSX.Element => {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.seekZoomLevel);
  const transport = useSelector((state: RootState) => state.transport);
  const isPlaying = transport === Transport.PLAY;
  const disabled = false;

  return (
    <div className="menu">
      <div>
        <button
          disabled={disabled}
          className="transport"
          type="button"
          onClick={(): void => {
            dispatch(handleTransport(isPlaying ? Transport.PAUSE : Transport.PLAY));
          }}
        >
          {isPlaying ? "pause" : "play"}
        </button>

        <button
          disabled={disabled}
          className="transport"
          type="button"
          onClick={(): void => {
            dispatch(handleTransport(Transport.STOP));
          }}
        >
          stop
        </button>
      </div>

      <div>
        <SliderRange
          max={10}
          min={1}
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
        ></SliderRange>

        <button
          type="button"
          onClick={(): void => {
            dispatch(addBar());
          }}
        >
          add bar
        </button>

        <button
          type="button"
          onClick={(): void => {
            dispatch(removeBar());
          }}
        >
          remove bar
        </button>

        <button
          type="button"
          onClick={(): void => {
            dispatch(clearSong());
          }}
        >
          clear song
        </button>

        <button
          type="button"
          onClick={(): void => {
            dispatch(handlePanic());
          }}
        >
          panic
        </button>

        {/* <button
          type="button"
          onClick={(): void => {
            dispatch(saveMIDIFile());
          }}
        >
          download
        </button> */}
      </div>
    </div>
  );
};
export { Menu };
