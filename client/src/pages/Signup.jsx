import React, { useState } from "react";
import { signupUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("All fields are required ⚠️");
      return;
    }

    try {
      setLoading(true);

      const res = await signupUser(form);

      alert("Signup successful 🔥");

      // Token save (if backend sends)
      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err?.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center">
      <form onSubmit={handleSubmit} className="card">
        <h2>Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;