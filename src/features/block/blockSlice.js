import { createSlice } from "@reduxjs/toolkit";

const blockSlice = createSlice({
  name: "blockSlice",
  initialState: {
    translatedBlocks: [],
  },
  reducers: {
    resetTranslatedBlocks: (state) => {
      state.translatedBlocks = [];
    },
    updateTranslatedBlocks: (state, action) => {
      state.translatedBlocks = action.payload;
    },
  },
});

export { blockSlice };
export const { resetTranslatedBlocks, updateTranslatedBlocks } =
  blockSlice.actions;
