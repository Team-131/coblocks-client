import React, { useRef, useState } from "react";
import styled from "styled-components";

import { WINDOW } from "../../config/constants";
import { cloneDeep } from "lodash";

function BlockCombinator() {
  const targetBlockIndex = useRef(); //도착 블럭의 인덱스
  const whileBlock = { type: "∞ 계속 반복하기", content: [] };
  const repeatBlock = { type: "🔁 반복하기", content: [] };
  const blocks = [
    { name: "🚶 앞으로 1칸 이동", isNestable: "false" },
    { name: "↪️ 오른쪽으로 회전하기", isNestable: "false" },
    { name: "↩️ 왼쪽으로 회전하기", isNestable: "false" },
    { name: "⚔️ 공격하기", isNestable: "false" },
    { name: "🧐 만약", isNestable: "false" },
    { name: "∞ 계속 반복하기", isNestable: "true" },
    { name: "🔁 반복하기", isNestable: "true" },
  ];

  const [logicBlocks, setLogicBlocks] = useState([]);
  const [BlocksCount, setBlocksCount] = useState(10);

  let blockIndex;
  let blockId;
  let parentId;
  let targetParentId;

  const dragStart = (event, index) => {
    event.stopPropagation();

    let blockName = event.target.innerText;

    if (blockName.includes("🧐 만약")) {
      blockName = "🧐 만약";
    }

    event.dataTransfer.setData("text", blockName);
    blockIndex = index;
    blockId = event.currentTarget.id;
    parentId = event.target.parentElement.id;
  };

  const dragEnter = (event, index) => {
    event.stopPropagation();

    targetBlockIndex.current = index;
    targetParentId = event.target.parentElement.id;
  };

  const handleBlock = (event) => {
    event.stopPropagation();

    const currentBlockText = event.dataTransfer.getData("text");
    const newLogicBlocks = logicBlocks.slice();
    const targetParentIndex = Number(targetParentId?.substr(10));
    const parentIndex = Number(parentId?.substr(10));
    const currentBlock = newLogicBlocks[blockIndex];
    const targetBlock = newLogicBlocks[targetBlockIndex.current];
    const newCurrentBlock = cloneDeep(currentBlock);
    const newParentBlock = cloneDeep(newLogicBlocks[parentIndex]);

    if (blockId.includes("codeBlock")) {
      if (BlocksCount > 0) {
        if (
          currentBlockText === "∞ 계속 반복하기" ||
          currentBlockText === "🔁 반복하기"
        ) {
          const insertBlock =
            currentBlockText === "∞ 계속 반복하기" ? whileBlock : repeatBlock;

          if (targetBlock) {
            newLogicBlocks.splice(targetBlockIndex.current, 0, insertBlock);
          } else {
            newLogicBlocks.push(insertBlock);
          }
        } else {
          if (!event.target.id.includes("if")) {
            if (targetParentId) {
              const newObjectBlock = cloneDeep(
                newLogicBlocks[targetParentIndex],
              );

              newObjectBlock["content"].splice(
                targetBlockIndex.current,
                0,
                currentBlockText,
              );
              newLogicBlocks[targetParentIndex] = newObjectBlock;
            } else {
              if (typeof targetBlock === "object") {
                const newObjectBlock = cloneDeep(targetBlock);

                newObjectBlock["content"].push(currentBlockText);
                newLogicBlocks.splice(
                  targetBlockIndex.current,
                  1,
                  newObjectBlock,
                );
              } else {
                newLogicBlocks.splice(
                  targetBlockIndex.current,
                  0,
                  currentBlockText,
                );
              }
            }
          } else {
            if (targetParentId.includes("childBlock")) {
              const index = Number(
                event.target.parentElement.parentElement.id.substr(10),
              );
              const newObjectBlock = cloneDeep(newLogicBlocks[index]);
              newObjectBlock["content"].splice(
                targetParentIndex,
                0,
                currentBlockText,
              );
              newLogicBlocks.splice(index, 1, newObjectBlock);
            } else {
              newLogicBlocks.splice(targetParentIndex, 0, currentBlockText);
            }
          }
        }

        setBlocksCount(BlocksCount - 1);
        setLogicBlocks(newLogicBlocks);
      }
    } else if (blockId.includes("logicBlock")) {
      if (typeof currentBlock === "object") {
        if (!targetParentId) {
          newLogicBlocks.splice(blockIndex, 1);
          newLogicBlocks.splice(targetBlockIndex.current, 0, newCurrentBlock);
        } else {
          newLogicBlocks.splice(blockIndex, 1);
          newLogicBlocks.splice(targetParentIndex, 0, newCurrentBlock);
        }
      } else {
        if (!targetParentId) {
          if (!event.target.id.includes("if")) {
            if (typeof currentBlock === "object") {
              const newObjectBlock = cloneDeep(targetBlock);

              newObjectBlock["content"].push(currentBlockText);
              newLogicBlocks.splice(
                targetBlockIndex.current,
                1,
                newObjectBlock,
              );
              newLogicBlocks.splice(blockIndex, 1);
            } else {
              newLogicBlocks.splice(blockIndex, 1);
              newLogicBlocks.splice(
                targetBlockIndex.current,
                0,
                currentBlockText,
              );
            }
          }
        } else {
          if (!event.target.id.includes("if")) {
            const newObjectBlock = cloneDeep(newLogicBlocks[targetParentIndex]);

            newObjectBlock["content"].splice(
              targetBlockIndex.current,
              0,
              currentBlockText,
            );
            newLogicBlocks.splice(targetParentIndex, 1, newObjectBlock);
            newLogicBlocks.splice(blockIndex, 1);
          }
        }
      }

      setLogicBlocks(newLogicBlocks);
    } else if (blockId.includes("childBlock")) {
      if (targetParentId) {
        if (parentId === targetParentId) {
          newParentBlock["content"].splice(blockIndex, 1);
          newParentBlock["content"].splice(
            targetBlockIndex.current,
            0,
            currentBlockText,
          );

          newLogicBlocks[parentIndex] = newParentBlock;
        } else if (parentId !== targetParentId) {
          if (!targetParentId.includes("childBlock")) {
            const newTargetObjectBlock = cloneDeep(
              newLogicBlocks[targetParentIndex],
            );

            newParentBlock["content"].splice(blockIndex, 1);
            newTargetObjectBlock["content"].splice(
              targetBlockIndex.current,
              0,
              currentBlockText,
            );
            newLogicBlocks[parentIndex] = newParentBlock;
            newLogicBlocks[targetParentIndex] = newTargetObjectBlock;
          }
        }
      } else {
        if (typeof targetBlock === "object") {
          if (parentIndex !== targetBlockIndex.current) {
            const newTargetObjectBlock = cloneDeep(targetBlock);

            newParentBlock["content"].splice(blockIndex, 1);
            newTargetObjectBlock["content"].push(currentBlockText);
            newLogicBlocks.splice(parentIndex, 1, newParentBlock);
            newLogicBlocks.splice(
              targetBlockIndex.current,
              1,
              newTargetObjectBlock,
            );
          }
        } else if (targetBlock) {
          newParentBlock["content"].splice(blockIndex, 1);
          newLogicBlocks[parentIndex] = newParentBlock;
          newLogicBlocks.splice(targetBlockIndex.current, 0, currentBlockText);
        } else {
          newParentBlock["content"].splice(blockIndex, 1);
          newLogicBlocks[parentIndex] = newParentBlock;
          newLogicBlocks.push(currentBlockText);
        }
      }

      setLogicBlocks(newLogicBlocks);
    }
  };

  const removeLogicBlock = () => {
    const newLogicBlocks = logicBlocks.slice();
    const parentIndex = Number(parentId.substr(10));

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
      const newWhileBlock = cloneDeep(newLogicBlocks[parentIndex]);

      newWhileBlock["content"].splice(blockIndex, 1);
      newLogicBlocks.splice(parentIndex, 1, newWhileBlock);
      setBlocksCount(BlocksCount + 1);
    }

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
          blockType === "🧐 만약" ? (
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
                {blockType["type"] === "🔁 반복하기" && (
                  <CountInput type={"text"}></CountInput>
                )}
              </div>
              {blockType["content"].map((childBlockType, childIndex) =>
                childBlockType === "🧐 만약" ? (
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
