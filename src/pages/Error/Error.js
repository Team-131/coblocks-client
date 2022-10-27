import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

function Error() {
  const location = useLocation();
  const navigate = useNavigate();

  const ErrorMessage = location.state?.error.message || "errorMessage";

  const handleClick = () => {
    navigate("/", { replace: true });
  };

  return (
    <Background>
      <Container>
        <TITLE>ERROR</TITLE>
        <Message>{ErrorMessage}</Message>
        <HomeButton onClick={handleClick}>🏠 홈으로</HomeButton>
      </Container>
    </Background>
  );
}

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 1rem;
  width: 30rem;
  height: 25rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
`;

const TITLE = styled.p`
  font-size: 3rem;
`;

const Message = styled.p`
  font-size: 1rem;
  margin: 3rem 0;
`;

const HomeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 3rem;
  background-color: #de3589;
  border-radius: 50px;
  color: #ffffff;
  font-size: 1.5rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;

  &:hover {
    color: #de3589;
    background-color: #ffffff;
    transition: all 200ms;
  }
`;

export { Error };
