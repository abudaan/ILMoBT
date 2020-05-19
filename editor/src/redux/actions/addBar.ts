import { ADD_BAR } from "../../constants";
import { AnyAction } from "redux";

export const addBar = (): AnyAction => {
  return {
    type: ADD_BAR,
  };
};
