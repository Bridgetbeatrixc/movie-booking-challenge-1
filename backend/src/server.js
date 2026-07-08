import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import bookingRoutes from "./routes/bookings.js";
import movieRoutes from "./routes/movies.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Beatrix Movie API is running" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Server error"
  });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API:", error.message);
    process.exit(1);
  });
