import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import { useDispatch } from "react-redux";

import {
  resetTranslatedBlocks,
  resetExecutingBlock,
  updateExecutingBlock,
} from "../../features/block/blockSlice";
import { tutorialMapsData } from "../../mapInfo/tutorialMapsData";

import { Modal } from "../../components/Modal/Modal";
import { Header } from "../../components/Header";
import { BlockCombinator } from "../../components/BlockCombinator";
import { Map } from "../../components/Map";

import { STARS, BUTTON, MESSAGE } from "../../config/constants";

function Tutorial() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [keyQuantity, setKeyQuantity] = useState(0);

  const navigate = useNavigate();
  const { tutorialId } = useParams();

  const allTutorialKeys = Object.keys(tutorialMapsData);

  const [mapData, setMapData] = useState(
    tutorialMapsData[tutorialId] && cloneDeep(tutorialMapsData[tutorialId]),
  );

  useEffect(() => {
    if (!tutorialMapsData[tutorialId]) {
      navigate("/not_found");
    }

    setMapData(cloneDeep(tutorialMapsData[tutorialId]));
    setIsSubmit(false);
  }, [tutorialId]);

  const moveNextStage = () => {
    dispatch(resetExecutingBlock());
    dispatch(resetTranslatedBlocks());

    const currentIndex = allTutorialKeys.indexOf(tutorialId);

    if (currentIndex + 1 === allTutorialKeys.length) {
      setResultMessage(MESSAGE.LAST_STAGE);
      setIsModalOpen(!isModalOpen);
    } else {
      navigate(`/tutorial/${allTutorialKeys[currentIndex + 1]}`, {
        replace: true,
      });
    }
  };

  const restart = () => {
    dispatch(updateExecutingBlock("end"));
    dispatch(resetTranslatedBlocks());
    setMapData(cloneDeep(tutorialMapsData[tutorialId]));
    setIsSubmit(false);
  };

  const start = () => {
    setIsSubmit(true);
  };

  const handleStarClick = (stage) => {
    dispatch(updateExecutingBlock("end"));
    dispatch(resetTranslatedBlocks());
    setMapData(cloneDeep(tutorialMapsData[tutorialId]));
    setIsSubmit(false);

    navigate(`/tutorial/${stage}`, { replace: true });
  };

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
                  onClick={() => handleStarClick(stage)}
                >
                  {STARS.EMPTY_STAR}
                </Star>
              ),
            )}
            <Tip>Tip: {mapData?.tip}</Tip>
          </GuideWrapper>
          <ButtonsWrapper>
            <Button onClick={restart} rightMargin={"4vw"}>
              {BUTTON.RESTART}
            </Button>
            <Button rightMargin={"15vw"} onClick={moveNextStage}>
              {BUTTON.NEXT_GAME}
            </Button>
          </ButtonsWrapper>
        </TopWrapper>
        <ContentsWrapper>
          <BlockCombinator
            submittedBlockInfo={isSubmit}
            setSubmittedBlockInfo={setIsSubmit}
            availableBlocks={mapData?.blocks || []}
            limitCount={mapData?.limitCount || 10}
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
            <div>
              {mapData.keyCount !== 0 &&
                Array(mapData.keyCount)
                  .fill("")
                  .map((none, index) =>
                    keyQuantity < index + 1 ? (
                      <img
                        src="/assets/image/emptyKey.png"
                        key={`keyCount-${index}`}
                        alt="emptyKey"
                        height="40px"
                        width="40px"
                      ></img>
                    ) : (
                      <img
                        src="/assets/image/key.png"
                        key={`keyCount-${index}`}
                        alt="fullFillKey"
                        height="40px"
                        width="40px"
                      ></img>
                    ),
                  )}
            </div>
            <Button onClick={start}>{BUTTON.START}</Button>
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
