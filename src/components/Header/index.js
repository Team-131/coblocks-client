import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { LOGO, BUTTON } from "../../config/constants";

function Header() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Logo onClick={() => navigate("/", { replace: true })}>
        <TextWhite>{LOGO.C}</TextWhite>
        <TextYellow>{LOGO.O}</TextYellow>
        <TextWhite>{LOGO.BLOCKS}</TextWhite>
      </Logo>
      <ButtonWrapper>
        <Button onClick={() => navigate("/tutorial/stage1", { replace: true })}>
          {BUTTON.TUTORIAL}
        </Button>
        <Button onClick={() => navigate("/game_list", { replace: true })}>
          {BUTTON.GAME_SELECTION}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.7vw;
  border: 0.3vw solid #000000;
  background: #de3589;
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15vw;
  font-size: 2.5vw;
  font-weight: bolder;
`;

const TextWhite = styled.span`
  color: #ffffff;
`;

const TextYellow = styled.span`
  padding-left: 0.3vw;
  color: #f5ed58;
  transform: rotate(45deg);
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-right: 15vw;
`;

const Button = styled.button`
  margin-left: 5vw;
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 1.5vw;
  font-weight: bolder;
`;

export default Header;
