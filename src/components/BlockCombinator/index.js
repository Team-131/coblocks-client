import React, { useState } from "react";
import styled from "styled-components";

import { WINDOW } from "../../config/constants";

function BlockCombinator() {
  const blocks = [
    "1칸전진",
    "왼쪽회전",
    "오른쪽회전",
    "if",
    "while",
    "공격",
    "놓기",
  ];

  const [logicBlocks, setLogicBlocks] = useState(
    Array.from({ length: 10 }).fill(""),
  );

  const dragStart = (event) => {
    event.dataTransfer.setData("text", event.target.innerText);
  };

  const drop = (event) => {
    const data = event.dataTransfer.getData("text");

    if (data && logicBlocks.includes("")) {
      const newLogicBlocks = logicBlocks.slice();

      newLogicBlocks.splice(newLogicBlocks.indexOf(""), 1, data);
      setLogicBlocks(newLogicBlocks);
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  return (
    <Wrapper>
      <WindowWrapper backGroundColor={"#64a9bd"}>
        <Title color={"#ffffff"}>{WINDOW.BLOCKS_SELECTION}</Title>
        {blocks.map((blockTitle) => (
          <Block
            key={blockTitle}
            id={blockTitle}
            onDragStart={dragStart}
            draggable="true"
          >
            {blockTitle}
          </Block>
        ))}
      </WindowWrapper>
      <WindowWrapper
        backGroundColor={"#f5ed58"}
        onDrop={drop}
        onDragOver={allowDrop}
      >
        <Title color={"#000000"} draggable="false">
          {WINDOW.BLOCKS_LOGIC}
        </Title>
        {logicBlocks.map((blockTitle, index) =>
          blockTitle ? (
            <Block
              key={`${blockTitle}${index}`}
              id={`${blockTitle}${index}`}
              draggable="true"
            >
              {blockTitle}
            </Block>
          ) : (
            <EmptyBlock
              key={`${blockTitle}${index}`}
              id={`${blockTitle}${index}`}
            >
              {blockTitle}
            </EmptyBlock>
          ),
        )}
      </WindowWrapper>
    </Wrapper>
  );
}

const Title = styled.div`
  padding: 1vw;
  color: ${(props) => props.color};
  font-size: 1.8vw;
  font-weight: bolder;
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
`;

const WindowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20vw;
  height: 70vh;
  margin-right: 3vw;
  border: 0.3vw solid #000000;
  background-color: ${(props) => props.backGroundColor};
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
`;

const Block = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 2.5rem;
  margin: 0.2rem 0;
  background-color: #7e72ce;
  border: 2px solid #000000;
  color: white;
  font-weight: bolder;
`;

const EmptyBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 2.5rem;
  margin: 0.2rem 0;
  border: 2px dashed #000000;
  background-color: transparent;
  color: white;
  font-weight: bolder;
`;

export default BlockCombinator;
