import React, { useEffect, useRef, useState } from "react";

import mapsData from "../../data/mapData";

function Map() {
  const ref = useRef(null);
  const [isMapData, setIsMapData] = useState(false);
  const [map, setMap] = useState([]);

  const cat = new Image();
  const assets = new Image();

  cat.src = "/assets/img/cat.png";
  assets.src = "/assets/img/coblocks-assets.png";

  useEffect(() => {
    if (mapsData) {
      setMap(mapsData["map1"]);
      setIsMapData(!isMapData);
    }
  }, []);

  useEffect(() => {
    if (isMapData) {
      assets.addEventListener(
        "load",
        () => {
          const startingCoord = getCoordinate(map.startingPoint);

          for (let coordY = 0; coordY < 10; coordY++) {
            for (let coordX = 0; coordX < 10; coordX++) {
              const mapElement = map.elements[coordY * 10 + coordX];
              const assetCoord = getCoordinate(mapElement);

              drawField(assets, coordX, coordY, map.defaultField, 0);

              if (mapElement !== -1) {
                drawField(assets, coordX, coordY, assetCoord.x, assetCoord.y);
              }
            }
          }

          drawField(cat, startingCoord.x, startingCoord.y, 0, 1);
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
    img,
    mapCoordX,
    mapCoordY,
    assetCoordX = 0,
    assetCoordY = 0,
  ) => {
    const ctx = ref.current.getContext("2d");
    ctx.drawImage(
      img,
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
