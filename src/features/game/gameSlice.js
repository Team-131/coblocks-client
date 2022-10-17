import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "gameSlice",
  initialState: {
    game1: { title: "", mapArray: [] },
    game2: { title: "", mapArray: [] },
  },
  reducers: {
    updateMap: (state, action) => {
      state[action.payload.gameId].mapArray = action.payload.mapArray;
    },
  },
});

export default gameSlice;
export const { updateMap } = gameSlice.actions;
