import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import { useDispatch } from "react-redux";

import { updateTranslatedBlocks } from "../../features/block/blockSlice";
import { WINDOW, BLOCK_NAMES } from "../../config/constants";

function BlockCombinator({ subMitBlockInfo, setSubMitBlockInfo }) {
  const targetBlockIndex = useRef();
  const { MOVE, TURN_RIGHT, TURN_LEFT, ATTACK, IF, WHILE, REPEAT } =
    BLOCK_NAMES;
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

  const dispatch = useDispatch();

  const [logicBlocks, setLogicBlocks] = useState([]);
  const [blocksCount, setBlocksCount] = useState(10);

  let blockIndex;
  let blockId;
  let parentElement;

  useEffect(() => {
    if (subMitBlockInfo) {
      translateBlocks();
      setSubMitBlockInfo(!subMitBlockInfo);
    }
  }, [subMitBlockInfo]);

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

  const limitNumberRange = (event) => {
    if (event.target.value < 1 || event.target.value > 9) {
      event.target.value = 1;
    }
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
      if (blocksCount > 0) {
        if (currentBlockText === WHILE || currentBlockText === REPEAT) {
          const insertedBlock =
            currentBlockText === WHILE ? whileBlock : repeatBlock;

          if (!event.target.id.includes("if")) {
            if (targetBlock) {
              newLogicBlocks.splice(targetBlockIndex.current, 0, insertedBlock);
            } else {
              newLogicBlocks.push(insertedBlock);
            }
          } else {
            newLogicBlocks.splice(
              getBlockIndex(targetParentElement.parentElement),
              0,
              insertedBlock,
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

        setBlocksCount(blocksCount - 1);
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
        setBlocksCount(blocksCount + 1);
      } else {
        const contentCount = newLogicBlocks[blockIndex]["content"].length;

        newLogicBlocks.splice(blockIndex, 1);
        setBlocksCount(blocksCount + contentCount + 1);
      }
    } else if (blockId.includes("childBlock")) {
      const newObjectBlock = newLogicBlocks[getBlockIndex(parentElement)];

      newObjectBlock["content"].splice(blockIndex, 1);
      newLogicBlocks.splice(getBlockIndex(parentElement), 1, newObjectBlock);
      setBlocksCount(blocksCount + 1);
    }
    setLogicBlocks(newLogicBlocks);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const translateBlocks = () => {
    const ifBlocks = document.querySelectorAll(".if");
    const counts = document.querySelectorAll(".count");
    const translatedBlocks = cloneDeep(logicBlocks);

    ifBlocks.forEach((element) => {
      const indexes = element.id.split("-");

      if (indexes.length === 3) {
        translatedBlocks[indexes[1]]["content"][indexes[2]] = element.value;
      } else {
        translatedBlocks[indexes[1]] = element.value;
      }
    });
    counts.forEach((element) => {
      const indexes = element.id.split("-");

      translatedBlocks[indexes[1]][indexes[0]] = element.value;
    });

    dispatch(updateTranslatedBlocks(translatedBlocks));
  };

  return (
    <Wrapper>
      <SelectionBlocks onDrop={removeLogicBlock} onDragOver={allowDrop}>
        <Title color={"#ffffff"}>{WINDOW.BLOCKS_SELECTION}</Title>
        {blocks.map((block, index) => {
          return block.isNestable === "false" ? (
            <NonNestableBlock
              key={block.name}
              id={`codeBlock${index}`}
              draggable="true"
              onDragStart={(event) => dragStart(event, index)}
            >
              {block.name}
            </NonNestableBlock>
          ) : (
            <NestableBlock
              backGroundColor={block.name === REPEAT ? "#37b647" : "#de3589"}
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
            <NonNestableBlock
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
            </NonNestableBlock>
          ) : blockType && typeof blockType === "string" ? (
            <NonNestableBlock
              key={`${blockType}${index}`}
              id={`logicBlock${index}`}
              draggable="true"
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
            >
              {blockType}
            </NonNestableBlock>
          ) : (
            <NestableBlock
              backGroundColor={
                blockType["type"] === REPEAT ? "#37b647" : "#de3589"
              }
              key={`${blockType["type"]}${index}`}
              id={`logicBlock${index}`}
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
              draggable="true"
            >
              <div>
                {blockType["type"]}
                {blockType["type"] === REPEAT && (
                  <CountInput
                    type={"number"}
                    id={`count-${index}`}
                    className={"count"}
                    onChange={limitNumberRange}
                    defaultValue={1}
                  ></CountInput>
                )}
              </div>
              {blockType["content"].map((childBlockType, childIndex) =>
                childBlockType === IF ? (
                  <NonNestableBlock
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
                  </NonNestableBlock>
                ) : (
                  <NonNestableBlock
                    key={`while${childBlockType}${childIndex}`}
                    id={`childBlock${childIndex}`}
                    draggable="true"
                    onDragStart={(event) => dragStart(event, childIndex)}
                    onDragEnter={(event) => dragEnter(event, childIndex)}
                  >
                    {childBlockType}
                  </NonNestableBlock>
                ),
              )}
            </NestableBlock>
          ),
        )}
        {Array(blocksCount)
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

const NonNestableBlock = styled.div`
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
  font-size: 1vw;
`;

const NestableBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  margin: 0.1rem 0;
  padding: 0.5rem 0.05rem;
  border: 2px solid #000000;
  background-color: ${(props) => props.backGroundColor};
  color: white;
  font-weight: bolder;
  font-size: 1vw;
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
  margin-left: 0.5rem;
  font-size: 0.6rem;
  border-radius: 4px;
  width: 65%;
`;

const CountInput = styled.input`
  margin-left: 0.5rem;
  text-align: center;
  border-radius: 4px;
  width: 2rem;
`;

BlockCombinator.propTypes = {
  subMitBlockInfo: PropTypes.bool.isRequired,
  setSubMitBlockInfo: PropTypes.func.isRequired,
};

export { BlockCombinator };
