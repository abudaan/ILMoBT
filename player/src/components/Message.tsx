import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";

export const Message = (): JSX.Element => {
  const tracks = useSelector((state: RootState) => state.tracks);
  const emailData = useSelector((state: RootState) => state.emailData);
  if (tracks.length > 1) {
    return null;
  }

  const message = [
    <div key="opening" className="opening">
      {`Hey ${emailData.receiver}`}
    </div>,
    <div key="content" className="content">
      {emailData.message}
    </div>,
    <div key="closing" className="closing">
      {emailData.sender}
    </div>,
  ];

  return <div className="email-message">{message}</div>;
};
