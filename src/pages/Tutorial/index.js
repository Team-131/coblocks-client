import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";

import { tutorialMapsData } from "../../mapInfo/tutorialMapsData";

import { Modal } from "../../components/Modal/Modal";
import { Header } from "../../components/Header";
import { BlockCombinator } from "../../components/BlockCombinator";
import { Map } from "../../components/Map";

import { STARS, BUTTON } from "../../config/constants";

function Tutorial() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [keyQuantity, setKeyQuantity] = useState(0);

  const navigate = useNavigate();
  const { tutorialId } = useParams();

  const allTutorialKeys = Object.keys(tutorialMapsData);

  const [mapData, setMapData] = useState(
    cloneDeep(tutorialMapsData[tutorialId]),
  );

  useEffect(() => {
    setMapData(cloneDeep(tutorialMapsData[tutorialId]));
  }, [tutorialId]);

  useEffect(() => {
    if (!tutorialMapsData[tutorialId]) {
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
      <Wrapper>
        <Header />
        <TopWrapper>
          <GuideWrapper>
            {allTutorialKeys.map((stage, index) =>
              stage === tutorialId ? (
                <Star color={"#f5ed58"} key={`tutorial${tutorialId}-${index}`}>
                  {STARS.FULFILLED_STAR}
                </Star>
              ) : (
                <Star
                  color={"#808080"}
                  key={`tutorial${tutorialId}-${index}`}
                  onClick={() =>
                    navigate(`/tutorial/${stage}`, { replace: true })
                  }
                >
                  {STARS.EMPTY_STAR}
                </Star>
              ),
            )}
            <Tip>Tip: {mapData.tip}</Tip>
          </GuideWrapper>
          <ButtonsWrapper>
            <Button rightMargin={"4vw"}>{BUTTON.REPEAT}</Button>
            <Button rightMargin={"15vw"}>{BUTTON.NEXT_GAME}</Button>
          </ButtonsWrapper>
        </TopWrapper>
        <ContentsWrapper>
          <BlockCombinator
            submittedBlockInfo={isSubmit}
            setSubmittedBlockInfo={setIsSubmit}
            availableBlocks={mapData.blocks}
            limitCount={mapData.limitCount}
            mapId={tutorialId}
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
            <Button onClick={() => setIsSubmit(!isSubmit)}>
              {BUTTON.START}
            </Button>
          </RightWrapper>
        </ContentsWrapper>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #393fb3;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5vw;
`;

const GuideWrapper = styled.div`
  display: absolute;
  margin-left: 15vw;
`;

const Star = styled.span`
  padding-right: 2.5vw;
  color: ${(props) => props.color};
  font-size: 1.5vw;
  font-weight: bolder;
`;

const Tip = styled.p`
  margin-top: 0.5vw;
  color: #ffffff;
  font-size: 1.3vw;
  font-weight: normal;
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

export default Tutorial;
