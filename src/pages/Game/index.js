import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import { useDispatch } from "react-redux";

import {
  resetTranslatedBlocks,
  updateExecutingBlock,
} from "../../features/block/blockSlice";
import { mapInfo } from "../../mapInfo/mapInfo";

import { Modal } from "../../components/Modal/Modal";
import { Header } from "../../components/Header";
import { BlockCombinator } from "../../components/BlockCombinator";
import { Map } from "../../components/Map/index";

import { BUTTON, MESSAGE } from "../../config/constants";

function Game() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [keyQuantity, setKeyQuantity] = useState(0);

  const navigate = useNavigate();
  const { gameId } = useParams();

  const mapInfoKeys = Object.keys(mapInfo);

  const [mapData, setMapData] = useState();

  useEffect(() => {
    if (!mapInfo[gameId]) {
      navigate("/not_found");
    }

    setMapData(cloneDeep(mapInfo[gameId]));
  }, [gameId]);

  const moveNextStage = () => {
    const currentIndex = mapInfoKeys.indexOf(gameId);

    if (currentIndex + 1 === mapInfoKeys.length) {
      setResultMessage(MESSAGE.LAST_STAGE);
      setIsModalOpen(!isModalOpen);
    } else {
      navigate(`/game/${mapInfoKeys[currentIndex + 1]}`, { replace: true });
    }
  };

  const restart = () => {
    dispatch(updateExecutingBlock("end"));
    dispatch(resetTranslatedBlocks());
    setMapData(cloneDeep(mapInfo[gameId]));
    setIsSubmit(false);
  };

  const start = () => {
    setIsSubmit(true);
  };

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
        <Title>{mapData?.title}</Title>
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
          mapId={gameId}
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
