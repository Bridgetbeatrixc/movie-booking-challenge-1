import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env and set your MongoDB URL.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await mongoose.connection.db.admin().command({ ping: 1 });

  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
