import React from "react";
import { Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import { Home } from "../pages/Home/Home";
import { Tutorial } from "../pages/Tutorial/Tutorial";
import { Game } from "../pages/Game/Game";
import { GameList } from "../pages/GameList/GameList";
import { Error } from "../pages/Error/Error";
import { NotFound } from "../pages/NotFound/NotFound";

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
      <audio
        src="/assets/audio/cat_and_soup.mp3"
        autoPlay={true}
        loop={true}
      ></audio>
      ;
    </>
  );
}

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
`;

export { App };
