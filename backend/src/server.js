import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import movieRoutes from "./modules/movies/movie.routes.js";
import showtimeRoutes from "./modules/showtimes/showtime.routes.js";
import { seedMovies } from "./shared/services/seedMovies.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
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
    }
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Beatrix Movie API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || (error.code === 11000 ? 409 : 500);

  res.status(status).json({
    message: error.code === 11000 ? "Duplicate resource." : error.message || "Server error",
    details: error.details
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
