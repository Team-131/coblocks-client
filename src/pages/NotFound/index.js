import React from "react";
import styled from "styled-components";

function NotFound() {
  return (
    <ImageWrapper>
      <img alt="error_page" src="assets/img/error_image.png" />
    </ImageWrapper>
  );
}

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default NotFound;
