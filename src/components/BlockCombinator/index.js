import React, { useRef, useState } from "react";
import styled from "styled-components";
import { cloneDeep } from "lodash";

import { WINDOW, BLOCKS } from "../../config/constants";

function BlockCombinator() {
  const targetBlockIndex = useRef(); //도착 블럭의 인덱스
  const { MOVE, TURN_RIGHT, TURN_LEFT, ATTACK, IF, WHILE, REPEAT } = BLOCKS;
  const whileBlock = { type: WHILE, content: [] };
  const repeatBlock = { type: REPEAT, content: [] };
  const blocks = [
    { name: MOVE, isNestable: "false" },
    { name: TURN_RIGHT, isNestable: "false" },
    { name: TURN_LEFT, isNestable: "false" },
    { name: ATTACK, isNestable: "false" },
    { name: IF, isNestable: "false" },
    { name: WHILE, isNestable: "true" },
    { name: REPEAT, isNestable: "true" },
  ];

  const [logicBlocks, setLogicBlocks] = useState([]);
  const [BlocksCount, setBlocksCount] = useState(10);

  let blockIndex;
  let blockId;
  let parentElement;

  const dragStart = (event, index) => {
    event.stopPropagation();

    let blockName = event.target.innerText;

    if (blockName.includes(IF)) {
      blockName = IF;
    }

    event.dataTransfer.setData("text", blockName);
    blockIndex = index;
    blockId = event.currentTarget.id;
    parentElement = event.target.parentElement;
  };

  const dragEnter = (event, index) => {
    event.stopPropagation();

    targetBlockIndex.current = index;
  };
  const getBlockIndex = (blockElement) => {
    return Number(blockElement.id.substr(10));
  };

  const handleBlock = (event) => {
    event.stopPropagation();

    const currentBlockText = event.dataTransfer.getData("text");
    const newLogicBlocks = logicBlocks.slice();
    const currentBlock = newLogicBlocks[blockIndex];
    const targetBlock = newLogicBlocks[targetBlockIndex.current];
    const targetParentElement = event.target.parentElement;
    const newParentBlock = newLogicBlocks[getBlockIndex(parentElement)];
    const newTargetParentBlock =
      newLogicBlocks[getBlockIndex(targetParentElement)];

    if (blockId.includes("codeBlock")) {
      if (BlocksCount > 0) {
        if (currentBlockText === WHILE || currentBlockText === REPEAT) {
          const insertBlock =
            currentBlockText === WHILE ? whileBlock : repeatBlock;
          if (!event.target.id.includes("if")) {
            if (targetBlock) {
              newLogicBlocks.splice(targetBlockIndex.current, 0, insertBlock);
            } else {
              newLogicBlocks.push(insertBlock);
            }
          } else {
            newLogicBlocks.splice(
              getBlockIndex(targetParentElement.parentElement),
              0,
              insertBlock,
            );
          }
        } else {
          if (!event.target.id.includes("if")) {
            if (targetParentElement.id) {
              newTargetParentBlock["content"].splice(
                targetBlockIndex.current,
                0,
                currentBlockText,
              );
              newLogicBlocks.splice(
                getBlockIndex(targetParentElement),
                1,
                newTargetParentBlock,
              );
            } else {
              if (typeof targetBlock === "object") {
                targetBlock["content"].push(currentBlockText);
                newLogicBlocks.splice(targetBlockIndex.current, 1, targetBlock);
              } else {
                newLogicBlocks.splice(
                  targetBlockIndex.current,
                  0,
                  currentBlockText,
                );
              }
            }
          } else {
            if (targetParentElement.id.includes("childBlock")) {
              const index = getBlockIndex(targetParentElement.parentElement);
              const newObjectBlock = cloneDeep(newLogicBlocks[index]);

              newObjectBlock["content"].splice(
                getBlockIndex(targetParentElement),
                0,
                currentBlockText,
              );
              newLogicBlocks.splice(index, 1, newObjectBlock);
            } else {
              newLogicBlocks.splice(
                getBlockIndex(targetParentElement),
                0,
                currentBlockText,
              );
            }
          }
        }

        setBlocksCount(BlocksCount - 1);
        setLogicBlocks(newLogicBlocks);
      }
    } else if (
      blockId.includes("logicBlock") &&
      !event.target.id.includes("if")
    ) {
      if (typeof currentBlock === "object") {
        if (!targetParentElement.id) {
          newLogicBlocks.splice(blockIndex, 1);
          newLogicBlocks.splice(targetBlockIndex.current, 0, currentBlock);
        } else {
          newLogicBlocks.splice(blockIndex, 1);
          newLogicBlocks.splice(
            getBlockIndex(targetParentElement),
            0,
            currentBlock,
          );
        }
      } else {
        if (!targetParentElement.id) {
          newLogicBlocks.splice(blockIndex, 1);
          newLogicBlocks.splice(targetBlockIndex.current, 0, currentBlockText);
        } else {
          newTargetParentBlock["content"].splice(
            targetBlockIndex.current,
            0,
            currentBlockText,
          );
          newLogicBlocks.splice(
            getBlockIndex(targetParentElement),
            1,
            newTargetParentBlock,
          );
          newLogicBlocks.splice(blockIndex, 1);
        }
      }

      setLogicBlocks(newLogicBlocks);
    } else if (blockId.includes("childBlock")) {
      if (targetParentElement.id) {
        if (parentElement.id === targetParentElement.id) {
          newParentBlock["content"].splice(blockIndex, 1);
          newParentBlock["content"].splice(
            targetBlockIndex.current,
            0,
            currentBlockText,
          );

          newLogicBlocks[getBlockIndex(parentElement)] = newParentBlock;
        } else if (parentElement.id !== targetParentElement.id) {
          if (!targetParentElement.id.includes("childBlock")) {
            const newTargetObjectBlock = cloneDeep(
              newLogicBlocks[getBlockIndex(targetParentElement)],
            );

            newParentBlock["content"].splice(blockIndex, 1);
            newTargetObjectBlock["content"].splice(
              targetBlockIndex.current,
              0,
              currentBlockText,
            );
            newLogicBlocks[getBlockIndex(parentElement)] = newParentBlock;
            newLogicBlocks[getBlockIndex(targetParentElement)] =
              newTargetObjectBlock;
          }
        }
      } else {
        if (typeof targetBlock === "object") {
          if (getBlockIndex(parentElement) !== targetBlockIndex.current) {
            const newTargetObjectBlock = cloneDeep(targetBlock);

            newParentBlock["content"].splice(blockIndex, 1);
            newTargetObjectBlock["content"].push(currentBlockText);
            newLogicBlocks.splice(
              getBlockIndex(parentElement),
              1,
              newParentBlock,
            );
            newLogicBlocks.splice(
              targetBlockIndex.current,
              1,
              newTargetObjectBlock,
            );
          }
        } else if (targetBlock) {
          newParentBlock["content"].splice(blockIndex, 1);
          newLogicBlocks[getBlockIndex(parentElement)] = newParentBlock;
          newLogicBlocks.splice(targetBlockIndex.current, 0, currentBlockText);
        } else {
          newParentBlock["content"].splice(blockIndex, 1);
          newLogicBlocks[getBlockIndex(parentElement)] = newParentBlock;
          newLogicBlocks.push(currentBlockText);
        }
      }

      setLogicBlocks(newLogicBlocks);
    }
  };

  const removeLogicBlock = () => {
    const newLogicBlocks = logicBlocks.slice();

    if (blockId.includes("logicBlock")) {
      if (typeof newLogicBlocks[blockIndex] === "string") {
        newLogicBlocks.splice(blockIndex, 1);
        setBlocksCount(BlocksCount + 1);
      } else {
        const countContents = newLogicBlocks[blockIndex]["content"].length;

        newLogicBlocks.splice(blockIndex, 1);
        setBlocksCount(BlocksCount + countContents + 1);
      }
    } else if (blockId.includes("childBlock")) {
      const newObjectBlock = newLogicBlocks[getBlockIndex(parentElement)];

      newObjectBlock["content"].splice(blockIndex, 1);
      newLogicBlocks.splice(getBlockIndex(parentElement), 1, newObjectBlock);
      setBlocksCount(BlocksCount + 1);
    }
    ``;
    setLogicBlocks(newLogicBlocks);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const translateBlocks = () => {
    const result = document.querySelectorAll(".if");
    const newLogicBlocks = cloneDeep(logicBlocks);
    result.forEach((element) => {
      const indexs = element.id.split("-");
      if (indexs.length === 3) {
        newLogicBlocks[indexs[1]]["content"][indexs[2]] = element.value;
      } else {
        newLogicBlocks[indexs[1]] = element.value;
      }
    });
    console.log(newLogicBlocks);
  };

  return (
    <Wrapper>
      <SelectionBlocks onDrop={removeLogicBlock} onDragOver={allowDrop}>
        <Title color={"#ffffff"}>{WINDOW.BLOCKS_SELECTION}</Title>
        {blocks.map((block, index) => {
          return block.isNestable === "false" ? (
            <NormalBlock
              key={block.name}
              id={`codeBlock${index}`}
              draggable="true"
              onDragStart={(event) => dragStart(event, index)}
            >
              {block.name}
            </NormalBlock>
          ) : (
            <NestableBlock
              key={block.name}
              id={`codeBlock${index}`}
              draggable="true"
              onDragStart={(event) => dragStart(event, index)}
            >
              {block.name}
            </NestableBlock>
          );
        })}
      </SelectionBlocks>
      <LogicBlocks
        backGroundColor={"#f5ed58"}
        onDrop={handleBlock}
        onDragOver={allowDrop}
      >
        <Title color={"#000000"} draggable="false">
          {WINDOW.BLOCKS_LOGIC}
        </Title>
        {logicBlocks.map((blockType, index) =>
          blockType === IF ? (
            <NormalBlock
              key={`${blockType}${index}`}
              id={`logicBlock${index}`}
              draggable="true"
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
            >
              {blockType}

              <SelectOption id={`if-${index}`} className={"if"}>
                <option value={"left"}>{"왼쪽으로 갈 수 있다면, ↪️"}</option>
                <option value={"right"}>{"오른쪽으로 갈 수 있다면, ↩️"}</option>
              </SelectOption>
            </NormalBlock>
          ) : blockType && typeof blockType === "string" ? (
            <NormalBlock
              key={`${blockType}${index}`}
              id={`logicBlock${index}`}
              draggable="true"
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
            >
              {blockType}
            </NormalBlock>
          ) : (
            <NestableBlock
              key={`${blockType["type"]}${index}`}
              id={`logicBlock${index}`}
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
              draggable="true"
            >
              <div>
                {blockType["type"]}
                {blockType["type"] === REPEAT && (
                  <CountInput type={"text"}></CountInput>
                )}
              </div>
              {blockType["content"].map((childBlockType, childIndex) =>
                childBlockType === IF ? (
                  <NormalBlock
                    key={`while${childBlockType}${childIndex}`}
                    id={`childBlock${childIndex}`}
                    draggable="true"
                    onDragStart={(event) => dragStart(event, childIndex)}
                    onDragEnter={(event) => dragEnter(event, childIndex)}
                  >
                    {childBlockType}
                    <SelectOption
                      id={`if-${index}-${childIndex}`}
                      className={"if"}
                    >
                      <option value={"left"}>
                        {"왼쪽으로 갈 수 있다면, ↪️"}
                      </option>
                      <option value={"right"}>
                        {"오른쪽으로 갈 수 있다면, ↩️"}
                      </option>
                    </SelectOption>
                  </NormalBlock>
                ) : (
                  <NormalBlock
                    key={`while${childBlockType}${childIndex}`}
                    id={`childBlock${childIndex}`}
                    draggable="true"
                    onDragStart={(event) => dragStart(event, childIndex)}
                    onDragEnter={(event) => dragEnter(event, childIndex)}
                  >
                    {childBlockType}
                  </NormalBlock>
                ),
              )}
            </NestableBlock>
          ),
        )}
        {Array(BlocksCount)
          .fill("")
          .map((blockType, index) => (
            <EmptyBlock
              key={`${blockType}${logicBlocks.length + index}`}
              id={`${blockType}${logicBlocks.length + index}`}
              onDragEnter={(event) =>
                dragEnter(event, logicBlocks.length + index)
              }
            >
              {blockType}
            </EmptyBlock>
          ))}
        <button onClick={translateBlocks}>버튼</button>
      </LogicBlocks>
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

const SelectionBlocks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20vw;
  height: 70vh;
  margin-right: 3vw;
  border: 0.3vw solid #000000;
  background-color: #64a9bd;
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
`;

const LogicBlocks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20vw;
  height: 70vh;
  margin-right: 3vw;
  border: 0.3vw solid #000000;
  background-color: #f5ed58;
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
`;

const NormalBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 5vh;
  margin: 0.1rem 0;
  padding: 0.5rem;
  background-color: #7e72ce;
  border: 2px solid #000000;
  color: white;
  font-weight: bolder;
`;

const NestableBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  margin: 0.1rem 0;
  padding: 0.5rem;
  border: 2px solid #000000;
  background-color: #de3589;
  color: white;
  font-weight: bolder;
`;

const EmptyBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 2.5rem;
  height: 5vh;
  margin: 0.2rem 0;
  border: 2px dashed #000000;
  background-color: transparent;
  color: white;
  font-weight: bolder;
`;

const SelectOption = styled.select`
  margin-left: 1rem;
  font-size: 0.6rem;
  border-radius: 4px;
  width: 100%;
`;

const CountInput = styled.input`
  margin-left: 0.5rem;
  text-align: center;
  border-radius: 4px;
  width: 2rem;
`;

export default BlockCombinator;
