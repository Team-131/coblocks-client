import React from "react";
import { Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import Home from "../pages/Home";
import Tutorial from "../pages/Tutorial";
import Game from "../pages/Game";
import GameList from "../pages/GameList";
import Error from "../pages/Error/Error";
import NotFound from "../pages/NotFound";

function App() {
  return (
    <>
      <Global />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/tutorial/:tutorialId" element={<Tutorial />} />
        <Route path="/game_list" element={<GameList />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
  }
`;

export default App;
