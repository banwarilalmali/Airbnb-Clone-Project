import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

// =======================
// 📦 CONFIG
// =======================
import connectDB from "./config/db.js";

// =======================
// 🚀 ROUTES
// =======================
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// =======================
// ❌ ERROR MIDDLEWARE
// =======================
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// =======================
// 🔑 LOAD ENV
// =======================
dotenv.config();

// =======================
// 🛢️ CONNECT DATABASE
// =======================
connectDB();

const app = express();

// =======================
// 🔐 SECURITY
// =======================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// =======================
// 📝 LOGGER
// =======================
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// =======================
// 🌐 CORS
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Vite often uses 5174+ if 5173 is busy — allow any localhost port in dev
      if (
        process.env.NODE_ENV !== "production" &&
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
      ) {
        return callback(null, true);
      }
      callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

// =======================
// 📦 BODY PARSER
// =======================
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// =======================
// 📁 STATIC FILES
// =======================
app.use("/uploads", express.static("uploads"));

// =======================
// 🚀 API ROUTES
// =======================

// 🔥 FIX: remove /v1 (match frontend)
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);

// =======================
// ❤️ HEALTH CHECK
// =======================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 API is healthy",
    timestamp: new Date(),
  });
});

// =======================
// ❌ 404 HANDLER
// =======================
app.use(notFound);

// =======================
// 💥 GLOBAL ERROR HANDLER
// =======================
app.use(errorHandler);

// =======================
// 🚀 SERVER START
// =======================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});

// =======================
// 🛑 GRACEFUL SHUTDOWN
// =======================
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("💥 Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down...");
  server.close(() => {
    console.log("💥 Process terminated");
  });
});