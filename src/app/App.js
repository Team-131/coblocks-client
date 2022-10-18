import React from "react";
import { createGlobalStyle } from "styled-components";

import Game from "../pages/Game";

function App() {
  return (
    <>
      <Global />
      <Game />
    </>
  );
}

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

export default App;
