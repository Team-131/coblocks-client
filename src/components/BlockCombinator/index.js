import React from "react";
import styled from "styled-components";

import { WINDOW } from "../../config/constants";

function BlockCombinator() {
  function BlockSelectionWindow() {
    return <Title color={"#ffffff"}>{WINDOW.BLOCKS_SELECTION}</Title>;
  }

  function BlockLogicWindow() {
    return <Title color={"#000000"}>{WINDOW.BLOCKS_LOGIC}</Title>;
  }

  return (
    <Wrapper>
      <WindowWrapper backGroundColor={"#64a9bd"}>
        <BlockSelectionWindow />
      </WindowWrapper>
      <WindowWrapper backGroundColor={"#f5ed58"}>
        <BlockLogicWindow />
      </WindowWrapper>
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

const WindowWrapper = styled.div`
  width: 20vw;
  height: 70vh;
  margin-right: 3vw;
  border: 0.3vw solid #000000;
  background-color: ${(props) => props.backGroundColor};
  box-shadow: 0vw 0.3vw 0.3vw rgba(0, 0, 0, 0.25);
`;

export default BlockCombinator;
