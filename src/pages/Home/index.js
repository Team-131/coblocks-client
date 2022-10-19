import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { LOGO, BUTTON } from "../../config/constants";

function Home() {
  const navigate = useNavigate();
  return (
    <Background>
      <Logo>
        <TextWhite>{LOGO.C}</TextWhite>
        <TextYellow>{LOGO.O}</TextYellow>
        <TextWhite>{LOGO.BLOCKS}</TextWhite>
      </Logo>
      <Button
        backgroundColor={"#071bbb"}
        color={"#ffffff"}
        onClick={() => navigate("/tutorial/123", { replace: true })}
      >
        <Icon className="fa-solid fa-gamepad" />
        {BUTTON.TUTORIAL}
      </Button>
      <Button
        backgroundColor={"#ffffff"}
        color={"#071bbb"}
        onClick={() => navigate("game_list", { replace: true })}
      >
        <Icon className="fa-solid fa-list" />
        {BUTTON.GAME_SELECTION}
      </Button>
    </Background>
  );
}

const Background = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f5ed58;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 30%;
  font-size: 13rem;
  font-weight: 900;
  margin-bottom: 3rem;
`;

const TextWhite = styled.span`
  color: #071bbb;
`;

const TextYellow = styled.span`
  color: #fd5ebb;
  transform: rotate(45deg);
`;

const Icon = styled.i`
  margin-right: 1rem;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 15rem;
  padding: 1vw;
  border: 3px solid #000000;
  border-radius: 30px;
  margin: 1vw;
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  font-size: 2rem;
  font-weight: bolder;
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
`;

export default Home;
