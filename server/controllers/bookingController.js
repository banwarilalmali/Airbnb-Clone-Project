import Booking from "../models/Booking.js";
import Property from "../models/Property.js";

// 🔧 Common response
const sendResponse = (res, status, success, message, data = {}) => {
  return res.status(status).json({
    success,
    message,
    ...data,
  });
};

// 🔥 CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, guests } = req.body;

    // 🧠 Validation
    if (!propertyId || !startDate || !endDate) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return sendResponse(res, 400, false, "Invalid date range");
    }

    // 🏠 Check property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return sendResponse(res, 404, false, "Property not found");
    }

    // NOTE: Original implementation prevented an owner from booking their own
    // property. For this project we allow it so that a host can test the full
    // booking flow using their own listing.

    // 🔥 Check overlapping booking
    const existing = await Booking.findOne({
      property: propertyId,
      status: { $ne: "cancelled" },
      $or: [
        {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate },
        },
      ],
    });

    if (existing) {
      return sendResponse(
        res,
        400,
        false,
        "Property already booked for selected dates"
      );
    }

    // 🚀 Create booking
    const booking = await Booking.create({
      user: req.user._id,
      property: propertyId,
      startDate,
      endDate,
      guests,
    });

    return sendResponse(res, 201, true, "Booking successful", {
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return sendResponse(res, 500, false, "Booking failed");
  }
};

// 🔥 GET USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("property")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Bookings fetched", {
      bookings,
    });
  } catch (error) {
    console.error("Get User Bookings Error:", error);
    return sendResponse(res, 500, false, "Fetch failed");
  }
};

// 🔥 GET PROPERTY BOOKINGS (HOST)
export const getPropertyBookings = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    // 🔐 Ownership check
    if (!property || property.user.toString() !== req.user._id.toString()) {
      return sendResponse(res, 403, false, "Not authorized");
    }

    const bookings = await Booking.find({ property: propertyId })
      .populate("user", "name email")
      .sort({ startDate: 1 });

    return sendResponse(res, 200, true, "Property bookings fetched", {
      bookings,
    });
  } catch (error) {
    console.error("Get Property Bookings Error:", error);
    return sendResponse(res, 500, false, "Fetch failed");
  }
};

// 🔥 CANCEL BOOKING (soft delete)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return sendResponse(res, 404, false, "Booking not found");
    }

    // 🔐 Only owner can cancel
    const bookingUserId = booking.user?._id || booking.user;
    if (!bookingUserId) {
      return sendResponse(res, 500, false, "Booking user missing");
    }
    if (String(bookingUserId) !== String(req.user._id)) {
      return sendResponse(res, 403, false, "Not authorized");
    }

    // ❌ Prevent re-cancel
    if (booking.status === "cancelled") {
      return sendResponse(res, 400, false, "Already cancelled");
    }

    booking.status = "cancelled";
    await booking.save();

    return sendResponse(res, 200, true, "Booking cancelled");
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return sendResponse(res, 500, false, error.message || "Cancel failed");
  }
};