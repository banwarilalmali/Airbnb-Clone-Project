import React from "react";

const PropertyImages = ({ images = [] }) => {
  return (
    <div className="flex" style={{ gap: "10px", flexWrap: "wrap" }}>
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="property"
          style={{ width: "200px", borderRadius: "10px" }}
        />
      ))}
    </div>
  );
};

export default PropertyImages;