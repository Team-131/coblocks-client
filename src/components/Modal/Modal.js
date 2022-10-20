import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Portal } from "../Portal";

function Modal({ closeModal, resultMessage, children }) {
  return (
    <Portal>
      <Background
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;

          closeModal();
        }}
      >
        <Content>
          {resultMessage}
          {children}
          <CloseButton onClick={closeModal}>확인</CloseButton>
        </Content>
      </Background>
    </Portal>
  );
}

const Background = styled.div`
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 40rem;
  height: 30rem;
  border: 5px solid #000000;
  border-radius: 10px;
  background-color: #f5ed58;
  color: #000000;
  font-size: 4rem;
  animation: smoothOpen 0.15s;

  @keyframes smoothOpen {
    from {
      opacity: 0;
      transform: translateY(-10%);
    }
    to {
      opacity: 1;
      transform: translateY(0%);
    }
  }
`;

const CloseButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 3rem;
  margin-top: 5rem;
  background-color: #de3589;
  border: 5px solid black;
  border-radius: 50px;
  color: #ffffff;
  font-size: 1.5rem;

  &:hover {
    color: #de3589;
    background-color: #ffffff;
    transition: all 200ms;
  }
`;

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  resultMessage: PropTypes.string,
  children: PropTypes.any,
};

export { Modal };
