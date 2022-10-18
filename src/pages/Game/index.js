import React from "react";
import styled from "styled-components";

import Header from "../../components/Header";
import BlockCombinator from "../../components/BlockCombinator";
import Map from "../../components/Map";

import { BUTTON } from "../../config/constants";

function Game() {
  return (
    <>
      <Header />
      <TopWrapper>
        <Title>여기는 제목 자리입니다.</Title>
        <ButtonsWrapper>
          <Button rightMargin={"4vw"}>{BUTTON.REPEAT}</Button>
          <Button rightMargin={"15vw"}>{BUTTON.NEXT_GAME}</Button>
        </ButtonsWrapper>
      </TopWrapper>
      <ContentsWrapper>
        <BlockCombinator />
        <RightWrapper>
          <Map />
          <Button>{BUTTON.START}</Button>
        </RightWrapper>
      </ContentsWrapper>
    </>
  );
}

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5vw;
`;

const Title = styled.span`
  margin-left: 15vw;
  font-size: 1.5vw;
  font-weight: bolder;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  height: 3.5vw;
  padding: 1vw;
  margin-right: ${(props) => props.rightMargin};
  border: 0.3vw solid #000000;
  border-radius: 2vw;
  background: #e1b2c6;
  color: #000000;
  font-size: 1.3vw;
  font-weight: bolder;
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
`;

const ContentsWrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-around;
  margin: 0 15vw;
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 70vh;
`;

export default Game;
