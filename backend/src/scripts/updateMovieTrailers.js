import dotenv from "dotenv";
import { movieTrailerIds } from "../data/movieTrailers.js";
import { connectDB } from "../config/db.js";
import { Movie } from "../modules/movies/movie.model.js";

dotenv.config();

try {
  await connectDB();

  let updated = 0;
  const missing = [];

  for (const [title, trailerVideoId] of Object.entries(movieTrailerIds)) {
    const result = await Movie.updateMany(
      { title, trailerVideoId: { $ne: trailerVideoId } },
      { $set: { trailerVideoId } }
    );

    if (result.matchedCount) {
      updated += result.modifiedCount;
    }
  }

  const moviesWithoutTrailer = await Movie.find({
    $or: [{ trailerVideoId: "" }, { trailerVideoId: { $exists: false } }]
  }).select("title");

  moviesWithoutTrailer.forEach((movie) => missing.push(movie.title));

  console.log(`Updated trailer IDs for ${updated} movie records.`);
  if (missing.length) {
    console.warn(`Movies still missing trailers: ${missing.join(", ")}`);
  } else {
    console.log("All movies in the current catalog have trailer IDs.");
  }

  process.exit(0);
} catch (error) {
  console.error("Updating movie trailers failed:", error.message);
  process.exit(1);
}
