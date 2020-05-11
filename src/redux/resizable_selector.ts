import { createSelector } from "reselect";
import { RootState, VAMPart } from "../types";

const dataSelector = (state: RootState, id: string): VAMPart => state.partsById[id];
const activeSelector = (state: RootState): string => state.editData.id;

const editDataSelector = createSelector(dataSelector, activeSelector, (data, id) => {
  // if ()
});
