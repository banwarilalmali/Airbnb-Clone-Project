import api from "./api";

// 🔧 Common Error Handler
const handleError = (error, label) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

  console.error(`${label}:`, message);
  throw new Error(message);
};

// ➕ CREATE BOOKING
export const createBooking = async (data) => {
  try {
    // Server mounts booking routes at /api/bookings (api baseURL already includes /api)
    const res = await api.post("/bookings", data);

    return {
      success: true,
      booking: res.data?.booking,
      message: res.data?.message || "Booking successful",
    };
  } catch (error) {
    handleError(error, "Create Booking Error");
  }
};

// 📄 GET USER BOOKINGS
export const getUserBookings = async () => {
  try {
    const res = await api.get("/bookings/my");

    return {
      success: true,
      bookings: res.data?.bookings || [],
    };
  } catch (error) {
    handleError(error, "Get User Bookings Error");
  }
};

// 🏠 GET PROPERTY BOOKINGS (HOST)
export const getPropertyBookings = async (propertyId) => {
  try {
    const res = await api.get(`/bookings/property/${propertyId}`);

    return {
      success: true,
      bookings: res.data?.bookings || [],
    };
  } catch (error) {
    handleError(error, "Get Property Bookings Error");
  }
};

// ❌ CANCEL BOOKING (SOFT DELETE)
export const cancelBooking = async (id) => {
  try {
    const res = await api.put(`/bookings/${id}/cancel`);

    return {
      success: true,
      message: res.data?.message || "Booking cancelled",
    };
  } catch (error) {
    handleError(error, "Cancel Booking Error");
  }
};