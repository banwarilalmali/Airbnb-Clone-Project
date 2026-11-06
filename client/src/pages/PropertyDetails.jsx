import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../services/propertyService";
import { createBooking } from "../services/bookingService";
import { useAuth } from "../hooks/useAuth";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  // 🧾 Booking State
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    guests: 1,
  });

  const [bookingLoading, setBookingLoading] = useState(false);

  // 🔥 Fetch Property
  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPropertyById(id);
      setProperty(res?.property || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load property");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  // 🔄 Handle input
  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 Handle Booking
  const handleBooking = async () => {
    if (!user) {
      alert("Please login first 🔐");
      return navigate("/login");
    }

    const { startDate, endDate } = bookingData;

    if (!startDate || !endDate) {
      return alert("Select booking dates 📅");
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return alert("Invalid date range ❌");
    }

    try {
      setBookingLoading(true);

      await createBooking({
        propertyId: id,
        ...bookingData,
      });

      alert("🎉 Booking successful!");
      navigate("/bookings");
    } catch (err) {
      alert(err.message || "Booking failed ❌");
    } finally {
      setBookingLoading(false);
    }
  };

  // 🔄 UI States
  if (loading) return <h3 style={styles.center}>Loading...</h3>;
  if (error) return <h3 style={styles.center}>{error}</h3>;
  if (!property) return <h3 style={styles.center}>Not found</h3>;

  return (
    <div style={styles.container}>
      {/* 🔙 Back */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>{property.title}</h2>
      <p style={styles.location}>{property.location}</p>

      {/* 🖼️ Main Image */}
      <img
        src={property.images?.[activeImage]}
        alt=""
        style={styles.mainImage}
      />

      {/* 🖼️ Gallery */}
      <div style={styles.gallery}>
        {property.images?.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            style={{
              ...styles.thumb,
              border: activeImage === i ? "2px solid black" : "",
            }}
            onClick={() => setActiveImage(i)}
          />
        ))}
      </div>

      {/* 📄 Info */}
      <div style={styles.details}>
        <h3>₹ {property.price} / night</h3>

        <p>
          {property.guests || 1} guests •{" "}
          {property.bedrooms || 1} beds •{" "}
          {property.bathrooms || 1} baths
        </p>

        <p>{property.description}</p>

        {/* 📅 BOOKING FORM */}
        <div style={styles.bookingBox}>
          <h3>Book this property</h3>

          <input
            type="date"
            name="startDate"
            value={bookingData.startDate}
            onChange={handleChange}
          />

          <input
            type="date"
            name="endDate"
            value={bookingData.endDate}
            onChange={handleChange}
          />

          <input
            type="number"
            name="guests"
            value={bookingData.guests}
            onChange={handleChange}
            min={1}
          />

          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            style={styles.bookBtn}
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;



// 🎨 Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
  },
  location: {
    color: "gray",
  },
  mainImage: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  gallery: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  thumb: {
    width: "80px",
    height: "60px",
    cursor: "pointer",
  },
  details: {
    marginTop: "20px",
  },
  bookingBox: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  bookBtn: {
    background: "black",
    color: "white",
    padding: "10px",
    border: "none",
    cursor: "pointer",
  },
  backBtn: {
    marginBottom: "10px",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
  },
};