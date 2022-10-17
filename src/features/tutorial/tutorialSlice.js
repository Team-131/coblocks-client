import { createSlice } from "@reduxjs/toolkit";

const tutorialSlice = createSlice({
  name: "tutorialSlice",
  initialState: {
    tutorial1: { title: "", mapArray: [] },
    tutorial2: { title: "", mapArray: [] },
  },
  reducers: {
    updateMap: (state, action) => {
      state[action.payload.tutorialId].mapArray = action.payload.mapArray;
    },
  },
});

export default tutorialSlice;
export const { updateMap } = tutorialSlice.actions;
