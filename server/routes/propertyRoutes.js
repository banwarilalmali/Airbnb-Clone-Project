import express from "express";
import {
  createProperty,
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 📌 PUBLIC ROUTES
 */

// 🔍 Get all properties (with filters, search, pagination future-ready)
router.get("/", optionalAuth, getProperties);

// 🔥 Get my properties
router.get("/my", protect, getMyProperties);

// 🔍 Get single property by ID
router.get("/:id", getPropertyById);



/**
 * 🔐 PROTECTED ROUTES (Only Logged-in Users)
 */

// ➕ Create property
router.post("/", protect, createProperty);

// ✏️ Update property (only owner)
router.put("/:id", protect, updateProperty);

// ❌ Delete property (only owner)
router.delete("/:id", protect, deleteProperty);



/**
 * 🧠 FUTURE-READY ROUTES (already structured for scaling)
 * (No need to change later 😏)
 */

// 👉 Example (later use):
// router.get("/user/my-properties", protect, getUserProperties);
// router.patch("/:id/availability", protect, toggleAvailability);



export default router;