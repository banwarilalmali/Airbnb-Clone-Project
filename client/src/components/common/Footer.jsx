import React from "react";

const Footer = () => {
  return (
    <footer
      className="container text-center"
      style={{ marginTop: "40px", padding: "20px 0" }}
    >
      <p>© {new Date().getFullYear()} Airbnb Clone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;