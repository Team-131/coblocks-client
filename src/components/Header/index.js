import React from "react";
import styled from "styled-components";

import { LOGO, BUTTON } from "../../config/constants";

function Header() {
  return (
    <>
      <Wrapper>
        <Logo>
          <TextWhite>{LOGO.C}</TextWhite>
          <TextYellow>{LOGO.O}</TextYellow>
          <TextWhite>{LOGO.BLOCKS}</TextWhite>
        </Logo>
        <ButtonWrapper>
          <Button>{BUTTON.TUTORIAL}</Button>
          <Button>{BUTTON.GAME_SELECTION}</Button>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.7vw;
  margin-top: 1vw;
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

const TextWhite = styled.div`
  color: #ffffff;
`;

const TextYellow = styled.div`
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
