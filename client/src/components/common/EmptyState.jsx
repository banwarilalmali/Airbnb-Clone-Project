import React from "react";

const EmptyState = ({ message = "No Data Found" }) => {
  return (
    <div className="flex-center" style={{ height: "50vh", flexDirection: "column" }}>
      <h2>{message}</h2>
      <p className="text-muted">Try refreshing or adding new data.</p>
    </div>
  );
};

export default EmptyState;