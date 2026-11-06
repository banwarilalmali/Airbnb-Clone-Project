// =======================
// ❌ NOT FOUND
// =======================
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// =======================
// 💥 ERROR HANDLER
// =======================
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // 🔴 MongoDB invalid ID
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  // 🔴 Duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = "User already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};