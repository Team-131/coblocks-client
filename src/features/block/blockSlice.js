import { createSlice } from "@reduxjs/toolkit";

const blockSlice = createSlice({
  name: "blockSlice",
  initialState: {
    translatedBlocks: [],
    isStarted: false,
  },
  reducers: {
    resetTranslatedBlocks: (state, action) => {
      state.translatedBlocks = [];
    },
    updateTranslatedBlocks: (state, action) => {
      state.translatedBlocks = action.payload.translatedBlocks;
    },
    setIsStarted: (state, action) => {
      state.isStarted = action.payload.isStarted;
    },
  },
});

export { blockSlice };
export const { resetTranslatedBlocks, updateTranslatedBlocks, setIsStarted } =
  blockSlice.actions;
