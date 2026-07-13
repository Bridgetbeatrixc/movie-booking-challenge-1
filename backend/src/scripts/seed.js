import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { seedMovies } from "../shared/services/seedMovies.js";

dotenv.config();

try {
  await connectDB();
  await seedMovies();
  console.log("Seed data is ready.");
  process.exit(0);
} catch (error) {
  console.error("Seeding failed:", error.message);
  process.exit(1);
}
