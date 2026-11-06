import express from "express";
import {
  createBooking,
  getUserBookings,
  getPropertyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// 🔥 =============================
// 📌 USER ROUTES
// 🔥 =============================

// ➕ Create Booking
// POST /api/bookings
router.post("/", protect, createBooking);

// 📄 Get My Bookings
// GET /api/bookings/my
router.get("/my", protect, getUserBookings);


// 🔥 =============================
// 🏠 HOST ROUTES
// 🔥 =============================

// 📊 Get bookings for a property (host only)
// GET /api/bookings/property/:propertyId
router.get("/property/:propertyId", protect, getPropertyBookings);


// 🔥 =============================
// ⚙️ ACTION ROUTES
// 🔥 =============================

// ❌ Cancel Booking (soft delete)
// PUT /api/bookings/:id/cancel
router.put("/:id/cancel", protect, cancelBooking);


// 🔥 =============================
// 🚀 FUTURE READY (optional)
// 🔥 =============================

// 👉 Get single booking
// router.get("/:id", protect, getBookingById);

// 👉 Admin: get all bookings
// router.get("/", protect, adminOnly, getAllBookings);

export default router;