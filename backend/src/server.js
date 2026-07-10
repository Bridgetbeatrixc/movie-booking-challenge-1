import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import movieRoutes from "./modules/movies/movie.routes.js";
import showtimeRoutes from "./modules/showtimes/showtime.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { seedMovies } from "./shared/services/seedMovies.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
)
  .split(",")
  .map((origin) => origin.trim());

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Beatrix Movie API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);

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
    details: error.details,
    stack: process.env.NODE_ENV === "production" ? null : error.stack
  });
});

connectDB()
  .then(seedMovies)
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API:", error.message);
    process.exit(1);
  });