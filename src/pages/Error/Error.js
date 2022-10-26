import React from "react";
import { useLocation } from "react-router-dom";

function Error() {
  const location = useLocation();
  return <>에러 페이지입니다.</>;
}

export default Error;
