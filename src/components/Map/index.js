import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { sleep } from "../../utils/sleep";
import { CHARACTER_DIRECTION, ASSET, RENDER } from "../../config/constants";

function Map({ mapInfo }) {
  const ref = useRef(null);
  const [character, setCharacter] = useState({ x: 0, y: 0, direction: 0 });

  const { UP, RIGHT, DOWN, LEFT, STAY } = CHARACTER_DIRECTION;
  const {
    SINGLE_ASSET_WIDTH,
    SINGLE_ASSET_HEIGHT,
    ROCK,
    WATER,
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

  const catAsset = new Image();
  const mapAsset = new Image();

  catAsset.src = "/assets/image/cat_asset.png";
  mapAsset.src = "/assets/image/map_asset.png";

  useEffect(() => {
    mapAsset.addEventListener(
      "load",
      () => {
        const { x: startingCoordinateX, y: startingCoordinateY } =
          getAssetCoordinate(mapInfo.startingPoint);

        setCharacter({
          x: startingCoordinateX,
          y: startingCoordinateY,
          direction: RIGHT,
        });

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

  const turnLeft = (character) => {
    const newCharacter = { ...character };

    if (newCharacter.direction === UP) {
      newCharacter.direction = LEFT;
    } else {
      newCharacter.direction--;
    }

    setCharacterDirection(newCharacter);
  };

  const turnRight = (character) => {
    const newCharacter = { ...character };

    if (newCharacter.direction === LEFT) {
      newCharacter.direction = UP;
    } else {
      newCharacter.direction++;
    }

    setCharacterDirection(newCharacter);
  };

  const setCharacterDirection = (newCharacter) => {
    const element = mapInfo.elements[newCharacter.y * 10 + newCharacter.x];
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

    setCharacter(newCharacter);
  };

  const getAssetCoordinate = (rawAssetIndex) => {
    if (rawAssetIndex === -1) {
      return { x: mapInfo.defaultField, y: 0 };
    }

    const x = rawAssetIndex % 10;
    const y = Math.floor(rawAssetIndex / 10);

    return { x, y };
  };

  const getForwardTileType = (character) => {
    const { forwardCoordinateX, forwardCoordinateY } =
      getForwardCoordinate(character);

    if (
      forwardCoordinateX < 0 ||
      forwardCoordinateX > 9 ||
      forwardCoordinateY < 0 ||
      forwardCoordinateY > 9
    ) {
      return "block";
    }

    const forwardElement =
      mapInfo.elements[forwardCoordinateY * 10 + forwardCoordinateX];

    switch (forwardElement) {
      case ROCK:
        return "block";
      case WATER:
        return "water";
      default:
        return "land";
    }
  };

  const getForwardCoordinate = (character, moveDirection) => {
    const direction = moveDirection || character.direction;
    let x = character.x;
    let y = character.y;

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
    const forwardTileType = getForwardTileType(character);
    let moveDirection = character.direction;

    if (forwardTileType === "block") {
      moveDirection = STAY;
    }

    const { forwardCoordinateX, forwardCoordinateY } = getForwardCoordinate(
      character,
      moveDirection,
    );
    const nextCharacter = {
      x: forwardCoordinateX,
      y: forwardCoordinateY,
      direction: character.direction,
    };
    const forwardAssetCoordinate = getAssetCoordinate(
      mapInfo.elements[forwardCoordinateY * 10 + forwardCoordinateX],
    );

    for (let i = 0; i < CAT_SPRITE_FRAMES * 2 + 1; i++) {
      const mapElement = mapInfo.elements[character.y * 10 + character.x];
      const { x: assetCoordinateX, y: assetCoordinateY } =
        getAssetCoordinate(mapElement);

      drawField({
        image: mapAsset,
        mapCoordinateX: character.x,
        mapCoordinateY: character.y,
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
        SINGLE_TILE_WIDTH * character.x +
          (nextCharacter.x - character.x) *
            (SINGLE_TILE_WIDTH / (CAT_SPRITE_FRAMES * 2)) *
            i,
        SINGLE_TILE_HEIGHT * character.y +
          (nextCharacter.y - character.y) *
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

    setCharacter(nextCharacter);
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
  };

  return (
    <>
      <canvas ref={ref} width={MAP_PIXEL_WIDTH} height={MAP_PIXEL_HEIGHT} />
      <TestButtons>
        <button onClick={() => turnLeft(character)}>왼쪽회전</button>
        <button onClick={() => turnRight(character)}>오른쪽회전</button>
        <button onClick={moveOneTile}>1칸전진</button>
      </TestButtons>
    </>
  );
}

const TestButtons = styled.div`
  display: flex;
`;

Map.propTypes = {
  mapInfo: PropTypes.object.isRequired,
};

export { Map };
