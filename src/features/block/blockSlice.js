import { createSlice } from "@reduxjs/toolkit";

const blockSlice = createSlice({
  name: "blockSlice",
  initialState: {
    translatedBlocks: [],
    executingBlock: "",
  },
  reducers: {
    resetTranslatedBlocks: (state) => {
      state.translatedBlocks = [];
    },
    updateTranslatedBlocks: (state, action) => {
      state.translatedBlocks = action.payload;
    },
    updateExecutingBlock: (state, action) => {
      state.executingBlock = action.payload;
    },
  },
});

export { blockSlice };
export const {
  resetTranslatedBlocks,
  updateTranslatedBlocks,
  updateExecutingBlock,
} = blockSlice.actions;
