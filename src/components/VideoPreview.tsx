import React, { useEffect, RefObject, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Transport } from "../types";
import { setVideoElement, onVideoReady } from "../redux/actions/handleOther";
import { TransportControls } from "./TransportControls";

const VideoPreview = (): JSX.Element => {
  const dispatch = useDispatch();
  console.log("RENDER PREVIEW VIDEO");
  // const refVideo: RefObject<HTMLVideoElement> = React.createRef();
  const refVideo: RefObject<HTMLVideoElement> = useRef();
  // const position = useSelector((state: RootState) => state.playheadPosition);

  // const url: string = useSelector((state: RootState) => {
  //   if (typeof state.tracksUI.video === "undefined") {
  //     return "";
  //   }
  //   return state.tracksUI.video.file.url;
  // });

  useEffect(() => {
    if (refVideo.current) {
      dispatch(setVideoElement(refVideo.current));
    }
  }, [refVideo.current]);

  // useEffect(() => {
  //   if (refVideo.current) {
  //     refVideo.current.currentTime = position / 1000;
  //     // console.log(position / 1000);
  //   }
  // }, [position]);

  return (
    <div className="video-container">
      <video
        onSeeked={() => {
          dispatch(onVideoReady(refVideo.current.currentTime));
        }}
        preload="auto"
        ref={refVideo}
        // src={url}
      ></video>
      <TransportControls></TransportControls>
    </div>
  );
};
export { VideoPreview };
