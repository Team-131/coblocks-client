import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";

import { mapInfo } from "../../mapInfo/mapInfo";

import { Modal } from "../../components/Modal/Modal";
import { Header } from "../../components/Header";
import { BlockCombinator } from "../../components/BlockCombinator";
import { Map } from "../../components/Map/index";

import { BUTTON } from "../../config/constants";

function Game() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [keyQuantity, setKeyQuantity] = useState(0);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [mapData, setMapData] = useState(cloneDeep(mapInfo[gameId]));

  useEffect(() => {
    setMapData(cloneDeep(mapInfo[gameId]));
  }, [gameId]);

  useEffect(() => {
    isModalOpen;
  }, [isModalOpen]);

  useEffect(() => {
    if (!mapInfo[gameId]) {
      navigate("/not_found");
    }
  }, []);

  return (
    <>
      {isModalOpen && (
        <Modal
          closeModal={() => setIsModalOpen(false)}
          resultMessage={resultMessage}
        />
      )}
      <Header />
      <TopWrapper>
        <Title>{mapData.title}</Title>
        <ButtonsWrapper>
          <Button rightMargin={"4vw"}>{BUTTON.REPEAT}</Button>
          <Button rightMargin={"15vw"}>{BUTTON.NEXT_GAME}</Button>
        </ButtonsWrapper>
      </TopWrapper>
      <ContentsWrapper>
        <BlockCombinator
          submitBlockInfo={isSubmit}
          setSubmitBlockInfo={setIsSubmit}
        />
        <RightWrapper>
          {mapData && (
            <Map
              mapInfo={mapData}
              setMapInfo={setMapData}
              setIsModalOpen={setIsModalOpen}
              setResultMessage={setResultMessage}
              keyQuantity={keyQuantity}
              setKeyQuantity={setKeyQuantity}
            />
          )}
          열쇠: {keyQuantity}
          <Button onClick={() => setIsSubmit(!isSubmit)}>{BUTTON.START}</Button>
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

export { Game };
