import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { sendToFriend } from "../redux/actions/sendToFriend";
import { setForm } from "../redux/actions/setForm";

export const Form = (): JSX.Element => {
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.form.name);
  const email = useSelector((state: RootState) => state.form.email);
  const nameFriend = useSelector((state: RootState) => state.form.nameFriend);
  const emailFriend = useSelector((state: RootState) => state.form.emailFriend);
  const message = useSelector((state: RootState) => state.form.message);
  const feedbackMessage = useSelector((state: RootState) => state.form.feedbackMessage);
  const disabled = false;

  return (
    <div className="form">
      <div className="form-item">
        <div>friend's name</div>
        <input
          onChange={e => {
            dispatch(setForm(e));
          }}
          id="nameFriend"
          type="text"
          value={nameFriend}
        ></input>
      </div>
      <div className="form-item">
        <div>friend's email</div>
        <input
          onChange={e => {
            dispatch(setForm(e));
          }}
          id="emailFriend"
          type="email"
          value={emailFriend}
        ></input>
      </div>
      <div className="form-item">
        <div>your name</div>
        <input
          onChange={e => {
            dispatch(setForm(e));
          }}
          id="name"
          type="text"
          value={name}
        ></input>
      </div>
      <div className="form-item">
        <div>your email</div>
        <input
          onChange={e => {
            dispatch(setForm(e));
          }}
          id="email"
          type="email"
          value={email}
        ></input>
      </div>
      <div className="form-item">
        <div>your message</div>
        <textarea
          onChange={e => {
            dispatch(setForm(e));
          }}
          id="message"
          value={message}
        ></textarea>
      </div>
      <div className="form-item submit">
        <button
          type="button"
          onClick={(): void => {
            dispatch(sendToFriend());
          }}
        >
          send to friend
        </button>
      </div>
      <div className="feedback-message">{feedbackMessage}</div>
    </div>
  );
};
