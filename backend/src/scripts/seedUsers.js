import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../modules/auth/auth.model.js";

dotenv.config();

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set. Please set it in your .env file before running the seeder.");
      process.exit(1);
    }

    await connectDB();

    const users = [
      { name: "Admin User", email: "admin@example.com", passwordHash: "AdminPass123!", role: "admin" },
      { name: "Alice Tester", email: "alice@example.com", passwordHash: "Password123!", role: "user" },
      { name: "Bob Tester", email: "bob@example.com", passwordHash: "Password123!", role: "user" }
    ];

    for (const u of users) {
      const existing = await User.findOne({ email: u.email }).select("_id");
      if (existing) {
        console.log(`User already exists: ${u.email}`);
        continue;
      }

      const user = new User(u);
      await user.save();
      console.log(`Created user: ${u.email} (${u.role})`);
    }

    console.log("Seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
