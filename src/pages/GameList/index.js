import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { Header } from "../../components/Header";
import mapsData from "../../data/mapData";

function GameList() {
  const navigate = useNavigate();

  const mapLists = Object.entries({ ...mapsData });

  return (
    <>
      <Header />
      <GuiedMessage>도전하고 싶은 맵을 선택하세요.</GuiedMessage>
      <ListWrapper>
        {mapLists.map((maplist) => (
          <GameTitleList
            key={maplist[0]}
            onClick={() => navigate(`/game/${maplist[0]}`, { replace: true })}
          >{`${maplist[0]}: ${maplist[1].title}`}</GameTitleList>
        ))}
      </ListWrapper>
    </>
  );
}

export { GameList };

const GuiedMessage = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10vh;
  font-size: 1.5vw;
  font-weight: bolder;
`;

const ListWrapper = styled.div`
  align-items: center;
  justify-content: space-between;
  height: 82vh;
  margin: 0 10vw 0 10vw;
  padding: 3vw;
  border: 0.3vw solid #000000;
  background: #393fb3;
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
`;

const GameTitleList = styled.p`
  margin: 1rem 0;
  color: white;
  font-size: 5vh;
  font-weight: bolder;
  text-align: center;
`;
