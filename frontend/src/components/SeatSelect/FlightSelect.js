import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { themeVars } from "../GlobalStyles";

const FlightSelect = ({ handleFlightSelect }) => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const getAllFlights = async () => {
      let reponse = await fetch("/allflights", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let response = await reponse.json();
      setFlights(response.data[0]);
    };
    getAllFlights();
  }, []);
  return (
    <Wrapper>
      <label htmlFor="flight">Flight Number :</label>
      <Select defaultValue="DEFAULT" onChange={handleFlightSelect}>
        <Options disabled value="DEFAULT" hidden>
          Select your flight
        </Options>
        {flights.map((flight) => {
          return <Options key={flight}>{flight}</Options>;
        })}
      </Select>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${themeVars.cadmiumRed};
  height: 80px;
  display: flex;
  align-items: center;
  padding: ${themeVars.pagePadding};
  margin-bottom: ${themeVars.pagePadding};
`;

const Select = styled.select`
  margin-left: 20px;
  margin-top: 10px;
  height: 40px;
  width: 200px;
  border-radius: 10px;
  border: 0px;
  padding: 10px;
`;

const Options = styled.option`
  font-size: 17px;
`;

export default FlightSelect;
