import React from "react";
import { formatDate } from "../../utils/helpers";

const BookingCard = ({ booking }) => {
  return (
    <div className="card">
      <h4>{booking.property?.title}</h4>
      <p>
        {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
      </p>
    </div>
  );
};

export default BookingCard;