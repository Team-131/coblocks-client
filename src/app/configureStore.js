import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import tutorialSlice from "../features/tutorial/tutorialSlice";
import gameSlice from "../features/game/gameSlice";

const store = configureStore({
  reducer: {
    tutorial: tutorialSlice.reducer,
    game: gameSlice.reducer,
  },
  middleware: [logger],
});

export default store;
