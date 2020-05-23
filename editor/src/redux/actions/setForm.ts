import { SyntheticEvent } from "react";
import { SET_FORM, NO_ACTION_REQUIRED } from "../../constants";
import { store } from "../store";
import { RootState } from "../../types";

export const setForm = (e: SyntheticEvent) => {
  // const state = store.getState() as RootState;
  // const { form } = state;
  // const index = Object.values(form).indexOf("");
  // const feedbackMessage = index !== -1 ? "Please fill out all fields." : "";

  const target = e.target as HTMLInputElement;
  // console.log(target.id, target.type, target.value);
  return {
    type: SET_FORM,
    payload: {
      [target.id]: target.value,
      feedbackMessage: "Please fill out all fields.",
    },
  };
};
