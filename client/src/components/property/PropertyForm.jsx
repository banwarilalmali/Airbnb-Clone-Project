import React, { useState } from "react";

const PropertyForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="card"
    >
      <h2>Add Property</h2>

      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />

      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default PropertyForm;