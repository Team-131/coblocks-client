import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import mapsData from "../../data/mapData";

function Map() {
  const ref = useRef(null);
  const [isMapData, setIsMapData] = useState(false);
  const [map, setMap] = useState([]);
  const navigate = useNavigate();

  const catSprite = new Image();
  const assets = new Image();

  catSprite.src = "/assets/image/cat.png";
  assets.src = "/assets/image/coblocks-assets.png";

  useEffect(() => {
    if (mapsData) {
      const key = window.location.pathname.split("/")[2];
      const mapData = mapsData[key];

      if (!mapData) {
        navigate("/not_found");
      }

      setMap(mapData);
      setIsMapData(!isMapData);
    }
  }, []);

  useEffect(() => {
    if (isMapData) {
      assets.addEventListener(
        "load",
        () => {
          const startingCoordinate = getCoordinate(map.startingPoint);

          for (let coordinateY = 0; coordinateY < 10; coordinateY++) {
            for (let coordinateX = 0; coordinateX < 10; coordinateX++) {
              const mapElement = map.elements[coordinateY * 10 + coordinateX];
              const assetCoordinate = getCoordinate(mapElement);

              drawField(assets, coordinateX, coordinateY, map.defaultField, 0);

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

          drawField(
            catSprite,
            startingCoordinate.x,
            startingCoordinate.y,
            0,
            1,
          );
        },
        false,
      );
    }
  }, [isMapData]);

  const getCoordinate = (data) => {
    if (data === -1) {
      return { x: map.defaultField, y: 0 };
    }

    const x = data % 10;
    const y = Math.floor(data / 10);
    return { x, y };
  };

  const drawField = (
    image,
    mapCoordX,
    mapCoordY,
    assetCoordX = 0,
    assetCoordY = 0,
  ) => {
    const ctx = ref.current.getContext("2d");
    ctx.drawImage(
      image,
      46 * assetCoordX,
      46 * assetCoordY,
      46,
      46,
      40 * mapCoordX,
      40 * mapCoordY,
      40,
      40,
    );
  };

  return <canvas ref={ref} width="400" height="400"></canvas>;
}

export default Map;
