import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import FlightSelect from "./FlightSelect";
import Form from "./Form";

const initialState = { seat: "", givenName: "", surname: "", email: "" };

const SeatSelect = ({ updateUserReservation }) => {
  const history = useHistory();
  const [flightNumber, setFlightNumber] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [disabled, setDisabled] = useState(true);
  const [subStatus, setSubStatus] = useState("idle");

  useEffect(() => {
    // This hook is listening to state changes and verifying whether or not all
    // of the form data is filled out.
    Object.values(formData).includes("") || flightNumber === ""
      ? setDisabled(true)
      : setDisabled(false);
  }, [flightNumber, formData, setDisabled]);

  const handleFlightSelect = (ev) => {
    setFlightNumber(ev.target.value);
    setFormData({ ...formData, flight: ev.target.value });
  };

  const handleSeatSelect = (seatId) => {
    setFormData({ ...formData, seat: seatId });
  };

  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };

  const validateEmail = () => {
    const emailParts = formData.email.split("@");
    return (
      emailParts.length === 2 &&
      emailParts[0].length > 0 &&
      emailParts[1].length > 0
    );
  };
  // console.log(JSON.stringify(formData));
  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validateEmail()) {
      // TODO: Send data to the server for validation/submission
      const sendFormData = async () => {
        let response = await fetch("/reservation", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        let res = await response.json();
        let data = res.data;
        // console.log(res);

        // TODO: if 201, add reservation id (received from server) to localStorage
        // TODO: if 201, redirect to /confirmed (push)
        if (res.status === 200) {
          // let reservationInfos = { ...res.data };
          // console.log(reservationInfos);
          const { email, flight, givenName, id, seat, surname } = data;
          // localStorage.setItem({
          //   email: email,
          //   flight: flight,
          //   givenName: givenName,
          //   id: id,
          //   seat: seat,
          //   surname: surname,
          // });
          localStorage.setItem("email", email);
          localStorage.setItem("flight", flight);
          localStorage.setItem("givenName", givenName);
          localStorage.setItem("id", id);
          localStorage.setItem("seat", seat);
          localStorage.setItem("surname", surname);
          history.push("/confirmed");
        }
      };
      sendFormData();
      // TODO: if error from server, show error to user (stretch goal)
    }
  };

  return (
    <>
      <FlightSelect
        flightNumber={flightNumber}
        handleFlightSelect={handleFlightSelect}
      />
      <h2>Select your seat and Provide your information!</h2>
      <Form
        flightNumber={flightNumber}
        formData={formData}
        handleChange={handleChange}
        handleSeatSelect={handleSeatSelect}
        handleSubmit={handleSubmit}
        disabled={disabled}
        subStatus={subStatus}
      />
    </>
  );
};

export default SeatSelect;
