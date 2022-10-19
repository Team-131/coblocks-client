import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import mapsData from "../../data/mapData";

function Map() {
  const ref = useRef(null);
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState({ x: 0, y: 0, direction: 0 }); //direction ->  up : 0, right: 1, down : 2, left : 3

  const mapData = mapsData[gameId];

  const catSprite = new Image();
  const assets = new Image();

  catSprite.src = "/assets/image/cat.png";
  assets.src = "/assets/image/coblocks-assets.png";

  useEffect(() => {
    if (!mapData) {
      return navigate("/not_found");
    }

    assets.addEventListener(
      "load",
      () => {
        const startingCoordinate = getCoordinate(mapData.startingPoint);

        setCharacter({
          x: startingCoordinate.x,
          y: startingCoordinate.y,
          direction: 1,
        });

        for (let coordinateY = 0; coordinateY < 10; coordinateY++) {
          for (let coordinateX = 0; coordinateX < 10; coordinateX++) {
            const mapElement = mapData.elements[coordinateY * 10 + coordinateX];
            const assetCoordinate = getCoordinate(mapElement);

            drawField(
              assets,
              coordinateX,
              coordinateY,
              mapData.defaultField,
              0,
            );

            if (mapElement !== -1) {
              drawField(
                assets,
                coordinateX,
                coordinateY,
                assetCoordinate.x,
                assetCoordinate.y,
              );
            }
          }
        }

        drawField(catSprite, startingCoordinate.x, startingCoordinate.y, 0, 1);
      },
      false,
    );
  }, []);

  const turnLeft = () => {
    const newCharacter = { ...character };

    if (newCharacter.direction === 0) {
      newCharacter.direction = 3;
    } else {
      newCharacter.direction--;
    }

    setCharacterDirection(newCharacter);
  };

  const turnRight = () => {
    const newCharacter = { ...character };

    if (newCharacter.direction === 3) {
      newCharacter.direction = 0;
    } else {
      newCharacter.direction++;
    }

    setCharacterDirection(newCharacter);
  };

  const setCharacterDirection = (newCharacter) => {
    const element = mapData.elements[character.y * 10 + character.x];
    const { x, y } = getCoordinate(element);

    drawField(assets, newCharacter.x, newCharacter.y, x, y);
    drawField(
      catSprite,
      newCharacter.x,
      newCharacter.y,
      0,
      newCharacter.direction,
    );

    setCharacter(newCharacter);
  };

  const getCoordinate = (data) => {
    if (data === -1) {
      return { x: mapData.defaultField, y: 0 };
    }

    const x = data % 10;
    const y = Math.floor(data / 10);

    return { x, y };
  };

  const drawField = (
    image,
    mapCoordinateX,
    mapCoordinateY,
    assetCoordinateX = 0,
    assetCoordinateY = 0,
  ) => {
    const context = ref.current.getContext("2d");

    context.drawImage(
      image,
      46 * assetCoordinateX,
      46 * assetCoordinateY,
      46,
      46,
      40 * mapCoordinateX,
      40 * mapCoordinateY,
      40,
      40,
    );
  };

  return <canvas ref={ref} width="400" height="400"></canvas>;
}

export default Map;
