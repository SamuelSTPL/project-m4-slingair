import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { themeVars } from "../GlobalStyles";

const Plane = ({ flightNumber, handleSeatSelect, selectedSeat }) => {
  // console.log(flightNumber);
  const [seating, setSeating] = useState([]);

  useEffect(() => {
    const getAllSeatings = async () => {
      if (flightNumber) {
        let reponse = await fetch(`/flight/${flightNumber}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        let response = await reponse.json();
        setSeating(response.data);
        // console.log(response);
      }
    };
    getAllSeatings();
  }, [flightNumber]);

  // console.log(seating);
  return (
    <Wrapper>
      {flightNumber && seating.length > 0 ? (
        seating.map((seat) => (
          <SeatWrapper key={`seat-${seat.id}`}>
            <label>
              {seat.isAvailable ? (
                <>
                  <Seat
                    type="radio"
                    name="seat"
                    onChange={() => handleSeatSelect(seat.id)}
                  />
                  <Available
                    className={selectedSeat === seat.id ? "checked" : ""}
                  >
                    {seat.id}
                  </Available>
                </>
              ) : (
                <Unavailable>{seat.id}</Unavailable>
              )}
            </label>
          </SeatWrapper>
        ))
      ) : (
        <Placeholder>Select a Flight to view seating.</Placeholder>
      )}
    </Wrapper>
  );
};

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 404px;
  width: 260px;
  text-align: center;
  color: ${themeVars.orange};
  font-family: ${themeVars.headingFont};
  font-size: 32px;
  opacity: 0.5;
`;

const Wrapper = styled.ol`
  display: grid;
  grid-template-rows: repeat(10, 30px);
  grid-template-columns: 30px 30px 60px 30px 30px 30px;
  gap: 12px 10px;
  background: #fff;
  border-right: 15px solid ${themeVars.alabamaCrimson};
  border-left: 15px solid ${themeVars.alabamaCrimson};
  margin: 24px 24px 0 0;
  padding: 48px 5px;
  height: 500px;
  width: 300px;
  position: relative;
`;
const SeatWrapper = styled.li`
  display: flex;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  height: 30px;
  width: 30px;
`;
const Seat = styled.input`
  opacity: 0;
  position: absolute;
  height: 30px;
  width: 30px;
  margin: 0;

  &:checked {
    span {
      background: ${themeVars.alabamaCrimson};
      color: #fff;
      font-weight: 700;
    }
  }
`;
const SeatNumber = styled.span`
  border-radius: 2px;
  color: ${themeVars.cadmiumRed};
  font-family: ${themeVars.contentFont};
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  width: 30px;
  transition: all ease 300ms;
`;
const Available = styled(SeatNumber)`
  background: #fff;
  border: 1px solid ${themeVars.alabamaCrimson};
  cursor: pointer;

  &.checked,
  &:hover {
    background: ${themeVars.alabamaCrimson};
    color: #fff;
    font-weight: 700;
  }
`;
const Unavailable = styled(SeatNumber)`
  background: ${themeVars.selectiveYellow};
  cursor: not-allowed;
  opacity: 0.4;
`;

export default Plane;
