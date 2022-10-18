import React from "react";
import styled from "styled-components";

function Map() {
  return <MapImage>Map (400px X 400px)</MapImage>;
}

const MapImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  border: 4px solid #000000;
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
`;

export default Map;
