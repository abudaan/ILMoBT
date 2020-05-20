import { SyntheticEvent } from "react";
import { SET_FORM, NO_ACTION_REQUIRED } from "../../constants";

export const setForm = (e: SyntheticEvent) => {
  const target = e.target as HTMLInputElement;
  // console.log(target.id, target.type, target.value);
  return {
    type: SET_FORM,
    payload: {
      [target.id]: target.value,
    },
  };
};
