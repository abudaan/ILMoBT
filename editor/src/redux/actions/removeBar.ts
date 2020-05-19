import { REMOVE_BAR } from "../../constants";
import { AnyAction } from "redux";

export const removeBar = (): AnyAction => {
  return {
    type: REMOVE_BAR,
  };
};
