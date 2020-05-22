import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleTransport } from "../redux/actions/handleTransport";
import { RootState, Transport } from "../types";

export const TransportControls = (): JSX.Element => {
  const dispatch = useDispatch();
  const transport = useSelector((state: RootState) => state.transport);
  const isPlaying = transport === Transport.PLAY;
  const disabled = false;

  return (
    <div className="transport-controls">
      <div>
        <button
          disabled={disabled}
          type="button"
          onClick={(): void => {
            dispatch(handleTransport(isPlaying ? Transport.PAUSE : Transport.PLAY));
          }}
        >
          {isPlaying ? "pause" : "play"}
        </button>
        <button
          disabled={disabled}
          type="button"
          onClick={(): void => {
            dispatch(handleTransport(Transport.STOP));
          }}
        >
          stop
        </button>
      </div>
    </div>
  );
};
