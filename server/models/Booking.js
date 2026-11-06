import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // 👤 User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏠 Property
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    // 📅 Dates
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // 👥 Guests
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },

    // 💰 Pricing
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 📌 Status (future ready)
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },

    // 💳 Payment (future)
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 VALIDATION: Dates check
bookingSchema.pre("validate", function (next) {
  if (this.startDate >= this.endDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

// 🔥 AUTO PRICE CALCULATION (based on property price)
bookingSchema.pre("save", async function (next) {
  if (!this.isModified("startDate") && !this.isModified("endDate")) {
    return next();
  }

  const Property = mongoose.model("Property");
  const property = await Property.findById(this.property);

  if (!property) {
    return next(new Error("Property not found"));
  }

  const days =
    (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);

  this.totalPrice = days * property.price;

  next();
});

// 🔥 CHECK OVERLAPPING BOOKINGS
bookingSchema.pre("save", async function (next) {
  // Only validate overlaps when creating a booking or changing its dates.
  // (Cancelling a booking should never trigger overlap validation.)
  if (!this.isNew && !this.isModified("startDate") && !this.isModified("endDate")) {
    return next();
  }

  const existing = await mongoose.model("Booking").findOne({
    _id: { $ne: this._id }, // exclude self on updates
    property: this.property,
    status: { $ne: "cancelled" },
    $or: [
      {
        startDate: { $lt: this.endDate },
        endDate: { $gt: this.startDate },
      },
    ],
  });

  if (existing) {
    return next(new Error("Property already booked for selected dates"));
  }

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;