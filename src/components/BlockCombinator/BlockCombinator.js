import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  updateTranslatedBlocks,
  resetExecutingBlock,
} from "../../features/block/blockSlice";
import { WINDOW, BLOCK_NAMES, COLOR } from "../../config/constants";
import { sleep } from "../../utils/sleep";

function BlockCombinator({
  submittedBlockInfo,
  availableBlocks,
  limitCount,
  mapId,
}) {
  const { MOVE, TURN_RIGHT, TURN_LEFT, ATTACK, IF, WHILE, REPEAT } =
    BLOCK_NAMES;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const targetBlockIndex = useRef();
  const selectBlocksRef = useRef([]);
  const selectOptionRef = useRef({});
  const repeatCountRef = useRef({});
  const previousBlock = useRef([]);
  const [logicBlocks, setLogicBlocks] = useState([]);
  const [blocksCount, setBlocksCount] = useState(limitCount);
  const [blockLimitAlarm, setBlockLimitAlarm] = useState(COLOR.GRAY);
  const [isBlockFreezed, setIsBlockFreezed] = useState(false);

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
  const selectExecutingBlock = useSelector(
    (state) => state.block.executingBlock,
  );

  let blockIndex;
  let blockId;
  let parentElement;

  useEffect(() => {
    if (submittedBlockInfo) {
      translateBlocks();
      setIsBlockFreezed(true);
    } else {
      setIsBlockFreezed(false);
    }
  }, [submittedBlockInfo]);

  useEffect(() => {
    setBlocksCount(limitCount);
  }, [limitCount]);

  useEffect(() => {
    setBlocksCount(limitCount);

    return () => {
      setLogicBlocks([]);
      setIsBlockFreezed(false);
      setBlocksCount(limitCount);
      dispatch(resetExecutingBlock());
      selectBlocksRef.current = [];
      selectOptionRef.current = {};
      repeatCountRef.current = {};
      previousBlock.current = [];
    };
  }, [mapId]);

  useEffect(() => {
    try {
      if (selectExecutingBlock) {
        const indexes = selectExecutingBlock.split("-");

        if (selectExecutingBlock !== "end") {
          paintBlock(indexes, COLOR.YELLOW, "5px");
        }

        if (previousBlock.current.length !== 0) {
          paintBlock(previousBlock.current, COLOR.DEEP_BLUE, "3px");
        }

        selectExecutingBlock === "end"
          ? (previousBlock.current = [])
          : (previousBlock.current = indexes);
      }
    } catch (error) {
      navigate("/error", { state: { error } });
    }
  }, [selectExecutingBlock]);

  const paintBlock = (indexes, color, width) => {
    try {
      if (!selectBlocksRef.current[indexes[0]]) return;

      if (indexes.length === 2) {
        selectBlocksRef.current[indexes[0]].childNodes[
          indexes[1]
        ].style.borderColor = color;
        selectBlocksRef.current[indexes[0]].childNodes[
          indexes[1]
        ].style.borderWidth = width;
      } else {
        selectBlocksRef.current[indexes[0]].style.borderColor = color;
        selectBlocksRef.current[indexes[0]].style.borderWidth = width;
      }
    } catch (error) {
      navigate("/error", { state: { error } });
    }
  };

  const dragStart = (event, index) => {
    if (isBlockFreezed) {
      return false;
    }

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
    if (event.target.value < 1) {
      event.target.value = 9;
    } else if (event.target.value > 9) {
      event.target.value = 1;
    }
  };

  const handleBlockLimitAlarm = async () => {
    setBlockLimitAlarm(COLOR.RED);

    await sleep(500);

    setBlockLimitAlarm(COLOR.GRAY);
  };

  const handleBlock = async (event) => {
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
              newLogicBlocks.splice(
                targetBlockIndex.current + 1,
                0,
                insertedBlock,
              );
            } else {
              newLogicBlocks.push(insertedBlock);
            }
          } else {
            newLogicBlocks.splice(
              getBlockIndex(targetParentElement.parentElement) + 1,
              0,
              insertedBlock,
            );
          }
        } else {
          if (!event.target.id.includes("if")) {
            if (targetParentElement.id) {
              newTargetParentBlock["content"].splice(
                targetBlockIndex.current + 1,
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
                getBlockIndex(targetParentElement) + 1,
                0,
                currentBlockText,
              );
              newLogicBlocks.splice(index, 1, newObjectBlock);
            } else {
              newLogicBlocks.splice(
                getBlockIndex(targetParentElement) + 1,
                0,
                currentBlockText,
              );
            }
          }
        }

        setBlocksCount(blocksCount - 1);
        setLogicBlocks(newLogicBlocks);
      } else {
        await handleBlockLimitAlarm();
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
    const translatedBlocks = cloneDeep(logicBlocks);

    for (const key in selectOptionRef.current) {
      const indexes = key.split("-");

      if (selectOptionRef.current[key]) {
        if (indexes.length === 2) {
          translatedBlocks[indexes[0]]["content"][indexes[1]] =
            selectOptionRef.current[key].value;
        } else {
          translatedBlocks[indexes[0]] = selectOptionRef.current[key].value;
        }
      }
    }

    for (const key in repeatCountRef.current) {
      if (repeatCountRef.current[key]) {
        translatedBlocks[key]["count"] = repeatCountRef.current[key].value;
      }
    }

    dispatch(updateTranslatedBlocks(translatedBlocks));
  };

  const clearLogicBlock = () => {
    if (!isBlockFreezed) {
      setLogicBlocks([]);
      setBlocksCount(limitCount);
      selectOptionRef.current = {};
      repeatCountRef.current = {};
    }
  };

  return (
    <Wrapper>
      <SelectionBlocks onDrop={removeLogicBlock} onDragOver={allowDrop}>
        <Title>{WINDOW.BLOCKS_SELECTION}</Title>
        {blocks.map((block, index) => {
          if (availableBlocks.includes(block.name)) {
            return block.isNestable === "false" ? (
              <NonNestableBlock
                key={block.name}
                id={`codeBlock${index}`}
                draggable={!isBlockFreezed}
                onDragStart={(event) => dragStart(event, index)}
              >
                {block.name}
              </NonNestableBlock>
            ) : (
              <NestableBlock
                backGroundColor={
                  block.name === REPEAT ? COLOR.GREEN : COLOR.RED
                }
                key={block.name}
                id={`codeBlock${index}`}
                draggable={!isBlockFreezed}
                onDragStart={(event) => dragStart(event, index)}
              >
                {block.name}
              </NestableBlock>
            );
          }
        })}
      </SelectionBlocks>
      <LogicBlocks
        backGroundColor={blockLimitAlarm}
        onDrop={handleBlock}
        onDragOver={allowDrop}
      >
        <Title>
          {WINDOW.BLOCKS_LOGIC}
          <ClearButton onClick={clearLogicBlock}>🗑️</ClearButton>
        </Title>
        {logicBlocks.map((blockType, index) =>
          blockType === IF ? (
            <NonNestableBlock
              key={`${blockType}${index}`}
              id={`logicBlock${index}`}
              ref={(element) => (selectBlocksRef.current[index] = element)}
              draggable={!isBlockFreezed}
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
            >
              {blockType}
              <SelectOption
                id={`if-${index}`}
                ref={(element) =>
                  (selectOptionRef.current[`${index}`] = element)
                }
              >
                <option value={"left"}>{"왼쪽으로 갈 수 있다면, ↪️"}</option>
                <option value={"right"}>{"오른쪽으로 갈 수 있다면, ↩️"}</option>
              </SelectOption>
            </NonNestableBlock>
          ) : blockType && typeof blockType === "string" ? (
            <NonNestableBlock
              key={`${blockType}${index}`}
              id={`logicBlock${index}`}
              ref={(element) => (selectBlocksRef.current[index] = element)}
              draggable={!isBlockFreezed}
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
            >
              {blockType}
            </NonNestableBlock>
          ) : (
            <NestableBlock
              backGroundColor={
                blockType["type"] === REPEAT ? COLOR.GREEN : COLOR.RED
              }
              key={`${blockType["type"]}${index}`}
              id={`logicBlock${index}`}
              ref={(element) => (selectBlocksRef.current[index] = element)}
              onDragStart={(event) => dragStart(event, index)}
              onDragEnter={(event) => dragEnter(event, index)}
              draggable={!isBlockFreezed}
            >
              <div>
                {blockType["type"]}
                {blockType["type"] === REPEAT && (
                  <CountInput
                    type={"number"}
                    id={`count-${index}`}
                    ref={(element) =>
                      (repeatCountRef.current[`${index}`] = element)
                    }
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
                    draggable={!isBlockFreezed}
                    onDragStart={(event) => dragStart(event, childIndex)}
                    onDragEnter={(event) => dragEnter(event, childIndex)}
                  >
                    {childBlockType}
                    <SelectOption
                      id={`if-${index}-${childIndex}`}
                      ref={(element) =>
                        (selectOptionRef.current[`${index}-${childIndex}`] =
                          element)
                      }
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
                    draggable={!isBlockFreezed}
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
              key={`emptyBlock${logicBlocks.length + index}`}
              id={`emptyBlock${logicBlocks.length + index}`}
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
  padding: 0.5rem;
  color: ${COLOR.DEEP_BLUE};
  font-size: 1.7rem;
  font-weight: bolder;
  text-align: center;
`;

const ClearButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.8rem;
  transition: all 300ms;
  cursor: pointer;

  &:hover {
    transform: scale(1.1) rotate(180deg);
  }
`;

const Wrapper = styled.div`
  display: flex;
`;

const SelectionBlocks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22vw;
  height: 70vh;
  margin-right: 2rem;
  border: 2.5px solid ${COLOR.BLACK};
  background-color: ${COLOR.YELLOW};
  box-shadow: 0rem 0.3rem 0.3rem rgba(0, 0, 0, 0.25);
`;

const LogicBlocks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22vw;
  height: 70vh;
  margin-right: 2rem;
  border: 2.5px solid ${COLOR.BLACK};
  background-color: ${(props) => props.backGroundColor};
  box-shadow: 0rem 0.3rem 0.3rem rgba(0, 0, 0, 0.25);
`;

const NonNestableBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 2.5rem;
  margin: 0.1rem 0;
  background-color: ${COLOR.BLUE};
  border: 2px solid ${COLOR.BLACK};
  color: white;
  font-weight: bolder;
  font-size: 1vw;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const NestableBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 0.1rem 0;
  padding: 0.5rem 0.05rem;
  border: 2px solid ${COLOR.BLACK};
  background-color: ${(props) => props.backGroundColor};
  color: white;
  font-weight: bolder;
  font-size: 1vw;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const EmptyBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 2.3rem;
  margin: 0.1rem 0;
  border: 2px dashed ${COLOR.BLACK};
  background-color: transparent;
  color: ${COLOR.WHITE};
  font-weight: bolder;
`;

const SelectOption = styled.select`
  width: 65%;
  margin-left: 0.5rem;
  border-radius: 4px;
  font-size: 0.6rem;
`;

const CountInput = styled.input`
  width: 2rem;
  margin-left: 0.5rem;
  border-radius: 4px;
  text-align: center;
`;

BlockCombinator.propTypes = {
  submittedBlockInfo: PropTypes.bool.isRequired,
  setSubmittedBlockInfo: PropTypes.func.isRequired,
  availableBlocks: PropTypes.array.isRequired,
  limitCount: PropTypes.number.isRequired,
  mapId: PropTypes.string.isRequired,
};

export { BlockCombinator };
