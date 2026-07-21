import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import movieRoutes from "./modules/movies/movie.routes.js";
import showtimeRoutes from "./modules/showtimes/showtime.routes.js";
import hallRoutes from "./modules/halls/hall.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";
const defaultClientOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];
const envClientOrigins = (process.env.CLIENT_URL || "").split(",").map((origin) => origin.trim());
const allowedOrigins = [...new Set([...defaultClientOrigins, ...envClientOrigins].filter(Boolean))];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true
  })
);

// Movie posters may be sent as validated base64 data URLs from the admin form.
// Keep this below MongoDB's document limit while allowing the frontend's 2 MB images.
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Beatrix Movie API is running", database: "managed by MongoDB" });
});

app.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? "ok" : "starting", database: connected ? "connected" : "disconnected" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/halls", hallRoutes);

app.use((req, res, next) => {
  const error = new Error(`Server endpoint not found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  let status = error.status || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = error.message || "Server error";

  if (error.code === 11000) {
    status = 409;
    message = "Duplicate record or showtime schedule detected.";
  }

  if (error.name === "ValidationError") {
    status = 400;
    message = Object.values(error.errors).map((val) => val.message).join(", ");
  }

  if (error.name === "CastError" && error.kind === "ObjectId") {
    status = 400;
    message = "Invalid data identity reference format (ObjectId).";
  }

  res.status(status).json({
    message,
    details: error.details || undefined
  });
});

// Start HTTP first, then retry MongoDB while the database container becomes ready.
// Compose starts services in order, but does not guarantee that MongoDB is accepting
// connections yet. Keeping the API alive makes the container observable during startup.
app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
});

async function connectWithRetry() {
  if (!process.env.MONGODB_URI) {
    console.error("Failed to connect to MongoDB: MONGODB_URI is missing.");
    process.exitCode = 1;
    return;
  }

  try {
    await connectDB();
  } catch (error) {
    console.error(`MongoDB is not ready (${error.message}). Retrying in 3 seconds...`);
    setTimeout(connectWithRetry, 3000);
  }
}

connectWithRetry();
