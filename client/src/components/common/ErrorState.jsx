import React from "react";

const ErrorState = ({ message = "Something went wrong" }) => {
  return (
    <div className="flex-center" style={{ height: "50vh", flexDirection: "column" }}>
      <h2>⚠️ Error</h2>
      <p className="text-muted">{message}</p>
    </div>
  );
};

export default ErrorState;