import React from "react";
import styled from "styled-components";

// import { themeVars } from "./GlobalStyles";
// import tombstone from "../assets/tombstone.png";

const Confirmation = () => {
  return (
    <Wrapper>
      <H1>
        Welcome aboard, {localStorage.getItem("givenName")}{" "}
        {localStorage.getItem("surname")}
        {" !"}
      </H1>
      <H1>Reservation Number: {localStorage.getItem("id")}</H1>
      <H1>Flight number: {localStorage.getItem("flight")}</H1>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 80%;
  margin: auto;
  text-align: center;
`;

const H1 = styled.h1`
  margin-top: 15px;
`;

export default Confirmation;
