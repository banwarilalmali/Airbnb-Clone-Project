import React, { useState } from "react";

const BookingForm = ({ onSubmit }) => {
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(dates);
      }}
      className="card"
    >
      <h3>Book Now</h3>

      <input
        type="date"
        onChange={(e) =>
          setDates({ ...dates, startDate: e.target.value })
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setDates({ ...dates, endDate: e.target.value })
        }
      />

      <button className="btn btn-primary">Confirm Booking</button>
    </form>
  );
};

export default BookingForm;