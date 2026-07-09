import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import bookingRoutes from "./routes/bookings.js";
import movieRoutes from "./routes/movies.js";
import showtimeRoutes from "./routes/showtimes.js";
import { seedMovies } from "./services/seedMovies.js";

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
    }
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Beatrix Movie API is running" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || (error.code === 11000 ? 409 : 500);

  res.status(status).json({
    message: error.code === 11000 ? "Duplicate showtime schedule." : error.message || "Server error",
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
