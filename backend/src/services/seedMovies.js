import { sampleMovies } from "../data/sampleMovies.js";
import { Movie } from "../models/Movie.js";

export async function seedMovies() {
  const movieCount = await Movie.countDocuments();

  if (movieCount > 0) {
    return;
  }

  await Movie.insertMany(sampleMovies);
  console.log("Sample movies seeded");
}
