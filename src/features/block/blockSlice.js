import { createSlice } from "@reduxjs/toolkit";

const blockSlice = createSlice({
  name: "blockSlice",
  initialState: {
    translatedBlocks: [],
    isStarted: false,
  },
  reducers: {
    resetTranslatedBlocks: (state) => {
      state.translatedBlocks = [];
    },
    updateTranslatedBlocks: (state, action) => {
      state.translatedBlocks = action.payload;
    },
    setIsStarted: (state, action) => {
      state.isStarted = action.payload;
    },
  },
});

export { blockSlice };
export const { resetTranslatedBlocks, updateTranslatedBlocks, setIsStarted } =
  blockSlice.actions;
