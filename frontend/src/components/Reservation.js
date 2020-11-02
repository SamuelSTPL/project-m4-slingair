import React from "react";
import styled from "styled-components";
import { themeVars } from "./GlobalStyles";

export const Reservation = ({ userReservation }) => {
  console.log(userReservation);
  return (
    <Wrapper>
      <H1>Your reservation</H1>
      <h3>
        Name : {userReservation.givenName} {userReservation.surname}
      </h3>
      <h3>Email : {userReservation.email}</h3>
      <h3>Seat : {userReservation.seat}</h3>
      <h3>Reservation number : {userReservation.id}</h3>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
  padding: 40px;
`;

const H1 = styled.h1`
  color: #d80026;
  margin-bottom: 30px;
`;
