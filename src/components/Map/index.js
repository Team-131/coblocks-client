import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";

import { updateExecutingBlock } from "../../features/block/blockSlice";
import { sleep } from "../../utils/sleep";

import {
  CHARACTER_DIRECTION,
  ASSET,
  RENDER,
  MESSAGE,
  SLEEP_TIME,
  BLOCK_NAMES,
} from "../../config/constants";

function Map({
  mapInfo,
  setMapInfo,
  setIsModalOpen,
  setResultMessage,
  keyQuantity,
  setKeyQuantity,
}) {
  const ref = useRef(null);
  const isEnded = useRef(false);
  const character = useRef({ x: 0, y: 0, direction: 0 });
  const newMapInfo = useRef(cloneDeep(mapInfo));
  const dispatch = useDispatch();
  const selectTranslatedBlocks = useSelector(
    (state) => state.block.translatedBlocks,
  );

  const { UP, RIGHT, DOWN, LEFT, STAY } = CHARACTER_DIRECTION;
  const {
    SINGLE_ASSET_WIDTH,
    SINGLE_ASSET_HEIGHT,
    DELETE_ELEMENT,
    ROCK,
    WATER,
    KEY,
    CLOSED_DOOR,
    OPEN_DOOR,
    PORTAL,
    PAW,
    GREEN_MONSTER,
    BLUE_MONSTER,
    CAT_SPRITE_FRAMES,
    CAT_DROWN_ROW,
    CAT_MOVE_FRAME_TIME,
    CAT_DROWN_FRAME_TIME,
  } = ASSET;
  const {
    SINGLE_TILE_WIDTH,
    SINGLE_TILE_HEIGHT,
    MAP_PIXEL_WIDTH,
    MAP_PIXEL_HEIGHT,
  } = RENDER;
  const { SUCCESS, FAIL } = MESSAGE;
  const { BLOCK_EXECUTION_TERM, MODAL_OPENING_DELAY } = SLEEP_TIME;
  const { MOVE, TURN_RIGHT, TURN_LEFT, ATTACK, WHILE, REPEAT } = BLOCK_NAMES;

  const catAsset = new Image();
  const mapAsset = new Image();

  catAsset.src = "/assets/image/cat_asset.png";
  mapAsset.src = "/assets/image/map_asset.png";

  useEffect(() => {
    (async () => {
      for (
        let blockIndex = 0;
        blockIndex < selectTranslatedBlocks.length;
        blockIndex++
      ) {
        if (isEnded.current) break;

        const block = selectTranslatedBlocks[blockIndex];

        if (typeof block === "string") {
          dispatch(updateExecutingBlock(`${blockIndex}`));

          await executeSingleBlock(block);
        }

        if (typeof block === "object") {
          if (block.type === WHILE) {
            dispatch(updateExecutingBlock(`${blockIndex}`));

            await sleep(BLOCK_EXECUTION_TERM);
            await executeWhileBlock(block.content, blockIndex);
          } else if (block.type === REPEAT) {
            dispatch(updateExecutingBlock(`${blockIndex}`));

            await sleep(BLOCK_EXECUTION_TERM);
            await executeRepeatBlock(block.count, block.content, blockIndex);
          }
        }
      }
    })();
  }, [selectTranslatedBlocks]);

  useEffect(() => {
    newMapInfo.current = cloneDeep(mapInfo);
    mapAsset.addEventListener(
      "load",
      () => {
        const { x: startingCoordinateX, y: startingCoordinateY } =
          getAssetCoordinate(mapInfo.startingPoint);

        character.current = {
          x: startingCoordinateX,
          y: startingCoordinateY,
          direction: RIGHT,
        };

        for (let mapCoordinateY = 0; mapCoordinateY < 10; mapCoordinateY++) {
          for (let mapCoordinateX = 0; mapCoordinateX < 10; mapCoordinateX++) {
            const mapElement =
              mapInfo.elements[mapCoordinateY * 10 + mapCoordinateX];
            const { x: assetCoordinateX, y: assetCoordinateY } =
              getAssetCoordinate(mapElement);

            drawField({
              image: mapAsset,
              mapCoordinateX,
              mapCoordinateY,
              assetCoordinateX: mapInfo.defaultField,
              assetCoordinateY: 0,
            });

            if (mapElement !== -1) {
              drawField({
                image: mapAsset,
                mapCoordinateX,
                mapCoordinateY,
                assetCoordinateX,
                assetCoordinateY,
              });
            }
          }
        }

        drawField({
          image: catAsset,
          mapCoordinateX: startingCoordinateX,
          mapCoordinateY: startingCoordinateY,
          assetCoordinateX: 0,
          assetCoordinateY: 1,
        });
      },
      false,
    );
  }, [mapInfo]);

  const executeWhileBlock = async (blockArray, parentIndex) => {
    for (let whileCount = 0; whileCount < 50; whileCount++) {
      for (let i = 0; i < blockArray.length; i++) {
        if (isEnded.current) return;

        dispatch(updateExecutingBlock(`${parentIndex}-${i}`));

        await executeSingleBlock(blockArray[i]);
      }
    }
  };

  const executeRepeatBlock = async (repeatCount, blockArray, parentIndex) => {
    for (let repeated = 0; repeated < repeatCount; repeated++) {
      for (let i = 0; i < blockArray.length; i++) {
        if (isEnded.current) return;

        dispatch(updateExecutingBlock(`${parentIndex}-${i}`));

        await executeSingleBlock(blockArray[i]);
      }
    }
  };

  const executeSingleBlock = async (block) => {
    if (block === MOVE) {
      await moveOneTile();
    }

    if (block === TURN_RIGHT) {
      turnRight();
    }

    if (block === TURN_LEFT) {
      turnLeft();
    }

    if (block === ATTACK) {
      await attack();
    }

    if (block.includes("left") && getSideTileType("left")) {
      turnLeft();
    }

    if (block.includes("right") && getSideTileType("right")) {
      turnRight();
    }

    await sleep(BLOCK_EXECUTION_TERM);
  };

  const getSideTileType = (side) => {
    let direction;

    side === "left"
      ? (direction = getLeftDirection(character.current.direction))
      : (direction = getRightDirection(character.current.direction));

    const tileType = getTileTypeOfSelectDirection(character, direction);

    return tileType === "land" || tileType === "portal" || tileType === "key";
  };

  const getLeftDirection = (direction) => {
    if (direction === UP) {
      direction = LEFT;
    } else {
      direction--;
    }

    return direction;
  };

  const getRightDirection = (direction) => {
    if (direction === LEFT) {
      direction = UP;
    } else {
      direction++;
    }

    return direction;
  };

  const turnLeft = () => {
    const newCharacter = { ...character.current };

    newCharacter.direction = getLeftDirection(newCharacter.direction);

    setCharacterDirection(newCharacter);
  };

  const turnRight = () => {
    const newCharacter = { ...character.current };

    newCharacter.direction = getRightDirection(newCharacter.direction);

    setCharacterDirection(newCharacter);
  };

  const setCharacterDirection = (newCharacter) => {
    const element =
      newMapInfo.current.elements[newCharacter.y * 10 + newCharacter.x];
    const { x: assetCoordinateX, y: assetCoordinateY } =
      getAssetCoordinate(element);

    drawField({
      image: mapAsset,
      mapCoordinateX: newCharacter.x,
      mapCoordinateY: newCharacter.y,
      assetCoordinateX,
      assetCoordinateY,
    });

    drawField({
      image: catAsset,
      mapCoordinateX: newCharacter.x,
      mapCoordinateY: newCharacter.y,
      assetCoordinateX: 0,
      assetCoordinateY: newCharacter.direction,
    });

    character.current = newCharacter;
  };

  const getAssetCoordinate = (rawAssetIndex) => {
    if (rawAssetIndex === -1) {
      return { x: newMapInfo.current.defaultField, y: 0 };
    }

    const x = rawAssetIndex % 10;
    const y = Math.floor(rawAssetIndex / 10);

    return { x, y };
  };

  const getTileTypeOfSelectDirection = (character, direction) => {
    const { forwardCoordinateX, forwardCoordinateY } =
      getCoordinateOfSelectDirection(character, direction);

    if (
      forwardCoordinateX < 0 ||
      forwardCoordinateX > 9 ||
      forwardCoordinateY < 0 ||
      forwardCoordinateY > 9
    )
      return "block";

    const forwardElement =
      newMapInfo.current.elements[forwardCoordinateY * 10 + forwardCoordinateX];

    switch (forwardElement) {
      case ROCK:
        return "block";
      case WATER:
        return "water";
      case KEY:
        return "key";
      case CLOSED_DOOR:
        return "closedDoor";
      case PORTAL:
        return "portal";
      case GREEN_MONSTER:
        return "greenMonster";
      case BLUE_MONSTER:
        return "blueMonster";
      default:
        return "land";
    }
  };

  const getCoordinateOfSelectDirection = (character, direction) => {
    let x = character.current.x;
    let y = character.current.y;

    switch (direction) {
      case UP:
        y--;
        break;
      case RIGHT:
        x++;
        break;
      case DOWN:
        y++;
        break;
      case LEFT:
        x--;
        break;
      default:
        break;
    }

    return { forwardCoordinateX: x, forwardCoordinateY: y };
  };

  const moveOneTile = async () => {
    const context = ref.current.getContext("2d");
    const forwardTileType = getTileTypeOfSelectDirection(
      character,
      character.current.direction,
    );
    let direction = character.current.direction;

    const replaceAsset = (replacement) => {
      const targetAsset = nextCharacter.y * 10 + nextCharacter.x;
      const copyMapInfo = { ...newMapInfo.current };

      copyMapInfo.elements[targetAsset] = replacement;
      newMapInfo.current = copyMapInfo;
    };

    if (forwardTileType === "block" || forwardTileType.includes("Monster")) {
      direction = STAY;

      setResultMessage(FAIL);

      isEnded.current = true;

      setTimeout(() => {
        setIsModalOpen(true);
      }, MODAL_OPENING_DELAY);
    }

    const { forwardCoordinateX, forwardCoordinateY } =
      getCoordinateOfSelectDirection(character, direction);
    const nextCharacter = {
      x: forwardCoordinateX,
      y: forwardCoordinateY,
      direction: character.current.direction,
    };

    if (forwardTileType === "key") {
      setKeyQuantity(keyQuantity + 1);

      replaceAsset(DELETE_ELEMENT);

      setMapInfo(mapInfo);
    }

    if (forwardTileType === "closedDoor") {
      if (keyQuantity > 0) {
        replaceAsset(OPEN_DOOR);

        setKeyQuantity(keyQuantity - 1);
      } else {
        setResultMessage(FAIL);

        isEnded.current = true;

        setTimeout(() => {
          setIsModalOpen(true);
        }, MODAL_OPENING_DELAY);
      }
    }

    if (forwardTileType === "portal") {
      setResultMessage(SUCCESS);

      isEnded.current = true;

      setTimeout(() => {
        setIsModalOpen(true);
      }, MODAL_OPENING_DELAY);
    }

    const forwardAssetCoordinate = getAssetCoordinate(
      newMapInfo.current.elements[forwardCoordinateY * 10 + forwardCoordinateX],
    );

    for (let i = 0; i < CAT_SPRITE_FRAMES * 2 + 1; i++) {
      const mapElement =
        newMapInfo.current.elements[
          character.current.y * 10 + character.current.x
        ];
      const { x: assetCoordinateX, y: assetCoordinateY } =
        getAssetCoordinate(mapElement);

      drawField({
        image: mapAsset,
        mapCoordinateX: character.current.x,
        mapCoordinateY: character.current.y,
        assetCoordinateX,
        assetCoordinateY,
      });

      drawField({
        image: mapAsset,
        mapCoordinateX: nextCharacter.x,
        mapCoordinateY: nextCharacter.y,
        assetCoordinateX: forwardAssetCoordinate.x,
        assetCoordinateY: forwardAssetCoordinate.y,
      });

      context.drawImage(
        catAsset,
        (i % CAT_SPRITE_FRAMES) * SINGLE_ASSET_WIDTH,
        SINGLE_ASSET_HEIGHT * nextCharacter.direction,
        SINGLE_ASSET_WIDTH,
        SINGLE_ASSET_HEIGHT,
        SINGLE_TILE_WIDTH * character.current.x +
          (nextCharacter.x - character.current.x) *
            (SINGLE_TILE_WIDTH / (CAT_SPRITE_FRAMES * 2)) *
            i,
        SINGLE_TILE_HEIGHT * character.current.y +
          (nextCharacter.y - character.current.y) *
            (SINGLE_TILE_WIDTH / (CAT_SPRITE_FRAMES * 2)) *
            i,
        SINGLE_TILE_WIDTH,
        SINGLE_TILE_HEIGHT,
      );

      await sleep(CAT_MOVE_FRAME_TIME);
    }

    if (forwardTileType === "water") {
      drown(nextCharacter.x, nextCharacter.y);
    }

    character.current = nextCharacter;
  };

  const drawField = ({
    image,
    mapCoordinateX,
    mapCoordinateY,
    assetCoordinateX = 0,
    assetCoordinateY = 0,
  }) => {
    const context = ref.current.getContext("2d");

    context.drawImage(
      image,
      SINGLE_ASSET_WIDTH * assetCoordinateX,
      SINGLE_ASSET_HEIGHT * assetCoordinateY,
      SINGLE_ASSET_WIDTH,
      SINGLE_ASSET_HEIGHT,
      SINGLE_TILE_WIDTH * mapCoordinateX,
      SINGLE_TILE_HEIGHT * mapCoordinateY,
      SINGLE_TILE_WIDTH,
      SINGLE_TILE_HEIGHT,
    );
  };

  const drown = async (coordinateX, coordinateY) => {
    isEnded.current = true;

    for (let i = 0; i < CAT_SPRITE_FRAMES; i++) {
      drawField({
        image: catAsset,
        mapCoordinateX: coordinateX,
        mapCoordinateY: coordinateY,
        assetCoordinateX: i,
        assetCoordinateY: CAT_DROWN_ROW,
      });

      await sleep(CAT_DROWN_FRAME_TIME);
    }

    setResultMessage(FAIL);

    setTimeout(() => {
      setIsModalOpen(true);
    }, MODAL_OPENING_DELAY);
  };

  const attack = async () => {
    const forwardTileType = getTileTypeOfSelectDirection(
      character,
      character.current.direction,
    );
    const copyMapInfo = { ...newMapInfo.current };

    let moveDirection = character.current.direction;

    const { forwardCoordinateX, forwardCoordinateY } =
      getCoordinateOfSelectDirection(character, moveDirection);
    const nextCharacter = {
      x: forwardCoordinateX,
      y: forwardCoordinateY,
      direction: character.current.direction,
    };
    const nextElement = nextCharacter.y * 10 + nextCharacter.x;

    if (forwardTileType.includes("Monster")) {
      let monsterColor;

      if (forwardTileType === "greenMonster") {
        monsterColor = Math.floor(GREEN_MONSTER / 10);
      } else if (forwardTileType === "blueMonster") {
        monsterColor = Math.floor(BLUE_MONSTER / 10);
      }

      for (let i = 0; i < CAT_SPRITE_FRAMES; i++) {
        drawField({
          image: mapAsset,
          mapCoordinateX: nextCharacter.x,
          mapCoordinateY: nextCharacter.y,
          assetCoordinateX: i,
          assetCoordinateY: monsterColor,
        });

        await sleep(CAT_DROWN_FRAME_TIME);
      }

      drawField({
        image: mapAsset,
        mapCoordinateX: nextCharacter.x,
        mapCoordinateY: nextCharacter.y,
        assetCoordinateX: mapInfo.defaultField,
        assetCoordinateY: 0,
      });

      copyMapInfo.elements[nextElement] = -1;
      newMapInfo.current = copyMapInfo;
    } else {
      const catPaw = Math.floor(PAW / 10);
      for (let i = 0; i < CAT_SPRITE_FRAMES; i++) {
        drawField({
          image: mapAsset,
          mapCoordinateX: nextCharacter.x,
          mapCoordinateY: nextCharacter.y,
          assetCoordinateX: i,
          assetCoordinateY: catPaw,
        });

        await sleep(CAT_DROWN_FRAME_TIME);
      }

      const { x: assetCoordinateX, y: assetCoordinateY } = getAssetCoordinate(
        copyMapInfo.elements[nextElement],
      );

      drawField({
        image: mapAsset,
        mapCoordinateX: nextCharacter.x,
        mapCoordinateY: nextCharacter.y,
        assetCoordinateX: assetCoordinateX,
        assetCoordinateY: assetCoordinateY,
      });
    }
  };

  return <canvas ref={ref} width={MAP_PIXEL_WIDTH} height={MAP_PIXEL_HEIGHT} />;
}

Map.propTypes = {
  mapInfo: PropTypes.object.isRequired,
  setMapInfo: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setResultMessage: PropTypes.func.isRequired,
  keyQuantity: PropTypes.number.isRequired,
  setKeyQuantity: PropTypes.func.isRequired,
};

export { Map };
