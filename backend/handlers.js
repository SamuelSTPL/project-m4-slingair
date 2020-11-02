"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

//  Use this data. Changes will persist until the server (backend) restarts.
const { flights, reservations } = require("./data");

///////////////////////////////////
const getFlights = (req, res) => {
  let allFlights = [];
  allFlights.push(Object.keys(flights));
  if (allFlights.length < 1) return res.status(404).json("No flights found");
  res
    .status(200)
    .json({ status: 200, data: allFlights, message: "Successful" });
};

///////////////////////////////////
const getFlight = (req, res) => {
  let flightNumber = req.params.flightNumber;
  let singleFlight = flights[flightNumber];
  if (!singleFlight)
    return res.status(404).json({
      status: 404,
      data: flightNumber,
      message: "Enter valid flight number",
    });
  res
    .status(200)
    .json({ status: 200, data: singleFlight, message: "Successful" });
};

///////////////////////////////////
const addReservations = (req, res) => {
  let newReservation = req.body;
  newReservation.id = uuidv4();
  console.log(req.body);
  let isExistingReservation = reservations.some((reservation) => {
    return reservation.id == newReservation.id;
  });
  let flightToCheck = flights[newReservation.flight];
  let seatToCheck = flightToCheck.find((flight) => {
    return flight.id === newReservation.seat;
  });
  //Check if the reservation was already booked
  if (isExistingReservation) {
    return res.status(400).json({
      status: 400,
      data: newReservation,
      message: "Reservation already created",
    });

    //Check if the form is properly filled
  } else if (!newReservation) {
    return res
      .status(400)
      .json({ status: 400, data: newReservation, message: "Fill the form" });

    //Check if the seat is available
  } else if (seatToCheck.isAvailable === false) {
    res.status(400).json({
      status: 400,
      data: newReservation,
      message: "Seat not available",
    });

    //Create new ID, switch the seat to not available, add the new reservation
  } else {
    seatToCheck.isAvailable = false;
    reservations.push(newReservation);
    res
      .status(200)
      .json({ status: 200, data: newReservation, message: "Successful" });
  }
};

///////////////////////////////////
const getReservations = (req, res) => {
  let allReservations = [];
  reservations.forEach((reservation) => {
    allReservations.push(reservation);
    return allReservations;
  });
  if (allReservations.length < 1)
    return res.status(404).json("No reservations found");
  res
    .status(200)
    .json({ status: 200, data: allReservations, message: "Query successful" });
};

///////////////////////////////
const getSingleReservation = (req, res) => {
  let reservationNumber = req.params.id;
  let singleReservation = reservations.find((reservation) => {
    return reservation.id == reservationNumber;
  });

  if (!singleReservation)
    return res.status(404).json({
      status: 404,
      data: singleReservation,
      message: "No such reservation",
    });
  res
    .status(200)
    .json({ status: 200, data: singleReservation, message: "Successful" });
};

///////////////////////////////////
const deleteReservation = (req, res) => {
  let reservationId = req.params.id;
  let indexToDelete = reservations.findIndex((reservation) => {
    return reservation.id === reservationId;
  });
  let seatToSwitchId = reservations[indexToDelete].seat;
  let flightNumberToChange = reservations[indexToDelete].flight;

  //Set the seat back to "available"
  let seatToSwitch = flights[flightNumberToChange].find((seat) => {
    return seat.id === seatToSwitchId;
  });
  seatToSwitch.isAvailable = true;

  //Remove the reservation
  reservations.splice(indexToDelete, 1);
  if (indexToDelete < 0) {
    return res.status(404).json({
      status: 404,
      data: reservationId,
      message: "Reservation not found",
    });
  }
  res.status(200).json({
    status: 200,
    data: reservationId,
    message: "We are sorry to see you leave",
  });
};

////////////////////////////////////
const updateReservation = (req, res) => {
  let reservationId = req.params.id;
  let userInfosToChange = req.body;

  //Check if the flight exist
  if (!(userInfosToChange.flight in flights)) {
    return res.status(400).json({
      status: 400,
      data: userInfosToChange,
      message: "Could not find the flight",
    });
  }
  //Check user infos
  if (Object.keys(userInfosToChange).length < 2) {
    return res.status(400).json({
      status: 400,
      data: userInfosToChange,
      message: "Data incomplete. Must include flight number AND seat number",
    });
  }

  let existingReservation = reservations.find((reservation) => {
    return reservation.id === reservationId;
  });

  //Check if the reservation exist
  if (!existingReservation) {
    return res.status(404).json({
      status: 404,
      data: userInfosToChange,
      message: "Reservation not found. Check the reservation ID",
    });
  }

  let oldSeat = flights[userInfosToChange.flight].find((seat) => {
    return seat.id == existingReservation.seat;
  });

  let newSeat = flights[userInfosToChange.flight].find((seat) => {
    return seat.id === userInfosToChange.seat;
  });

  //Check if the wanted seat is available
  if (!newSeat.isAvailable) {
    return res.status(400).json({
      status: 400,
      data: userInfosToChange,
      message: "Seat already taken",
    });
  }
  //Change infos for the seat and flight, switch both seats availability
  else {
    existingReservation.seat = req.body.seat;
    existingReservation.flight = req.body.flight;
    oldSeat.isAvailable = true;
    newSeat.isAvailable = false;
    res.status(200).json({
      status: 200,
      data: existingReservation,
      message: "Infos successfully updated",
    });
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservations,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
