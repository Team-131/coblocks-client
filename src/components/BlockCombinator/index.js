import React, { useRef, useState } from "react";
import styled from "styled-components";

import { WINDOW } from "../../config/constants";

function BlockCombinator() {
  const dragOverBlock = useRef();
  const blocks = ["1칸전진", "오른쪽회전", "왼쪽회전", "공격", "if", "while"];

  const [logicBlocks, setLogicBlocks] = useState(
    Array.from({ length: 10 }).fill(""),
  );

  let blockIndex;
  let blockId;

  const dragStart = (event, index) => {
    event.dataTransfer.setData("text", event.target.innerText);
    blockIndex = index;
    blockId = event.currentTarget.id;
  };

  const dragEnter = (event, index) => {
    dragOverBlock.current = index;
  };

  const hendleBlock = (event) => {
    const dragBlockText = event.dataTransfer.getData("text");
    const newLogicBlocks = logicBlocks.slice();
    const firstEmptyBlock = newLogicBlocks.indexOf("");

    if (blockId.includes("blocksLogic")) {
      if (newLogicBlocks[dragOverBlock.current]) {
        newLogicBlocks.splice(blockIndex, 1);
        newLogicBlocks.splice(dragOverBlock.current, 0, dragBlockText);

        setLogicBlocks(newLogicBlocks);
      } else if (!newLogicBlocks[dragOverBlock.current]) {
        newLogicBlocks.splice(blockIndex, 1);
        newLogicBlocks.splice(newLogicBlocks.indexOf(""), 1, dragBlockText);
        newLogicBlocks.push("");

        setLogicBlocks(newLogicBlocks);
      }
    } else {
      if (firstEmptyBlock !== -1) {
        if (newLogicBlocks[dragOverBlock.current]) {
          newLogicBlocks.splice(firstEmptyBlock, 1);
          newLogicBlocks.splice(dragOverBlock.current, 0, dragBlockText);

          setLogicBlocks(newLogicBlocks);
        } else {
          newLogicBlocks.splice(firstEmptyBlock, 1, dragBlockText);

          setLogicBlocks(newLogicBlocks);
        }
      }
    }
  };

  const removeLogicBlock = () => {
    const newLogicBlocks = logicBlocks.slice();

    if (blockId.includes("blocksLogic")) {
      newLogicBlocks.splice(blockIndex, 1);
      newLogicBlocks.push("");

      setLogicBlocks(newLogicBlocks);
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  return (
    <Wrapper>
      <WindowWrapper
        backGroundColor={"#64a9bd"}
        onDrop={removeLogicBlock}
        onDragOver={allowDrop}
      >
        <Title color={"#ffffff"}>{WINDOW.BLOCKS_SELECTION}</Title>
        {blocks.map((blockTitle, index) => (
          <Block
            key={blockTitle}
            id={blockTitle}
            draggable="true"
            onDragStart={(event) => dragStart(event, index)}
          >
            {blockTitle}
          </Block>
        ))}
      </WindowWrapper>
      <WindowWrapper
        backGroundColor={"#f5ed58"}
        onDrop={hendleBlock}
        onDragOver={allowDrop}
      >
        <Title color={"#000000"} draggable="false">
          {WINDOW.BLOCKS_LOGIC}
        </Title>
        {logicBlocks.map((blockTitle, index) =>
          blockTitle ? (
            <Block
              key={`${blockTitle}${index}`}
              id={`blocksLogic${index}`}
              draggable="true"
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
            >
              {blockTitle}
            </Block>
          ) : (
            <EmptyBlock
              key={`${blockTitle}${index}`}
              id={`${blockTitle}${index}`}
              onDragEnter={(event) => dragEnter(event, index)}
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
  width: 13vw;
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
  width: 13vw;
  height: 2.5rem;
  margin: 0.2rem 0;
  border: 2px dashed #000000;
  background-color: transparent;
  color: white;
  font-weight: bolder;
`;

export default BlockCombinator;
