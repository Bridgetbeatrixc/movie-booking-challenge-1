import { sampleMovies } from "../../data/sampleMovies.js";
import { sampleShowtimes } from "../../data/sampleShowtimes.js";
import { Movie } from "../../modules/movies/movie.model.js";
import { Showtime } from "../../modules/showtimes/showtime.model.js";
import { User } from "../../modules/auth/auth.model.js";

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function seedMovies() {
  const demoPassword = process.env.SEED_DEMO_PASSWORD || "ChallengePass123!";
  const users = [
    { name: "Beatrix Admin", email: "admin@beatrix.test", role: "admin" },
    { name: "Demo User One", email: "user1@beatrix.test", role: "user" },
    { name: "Demo User Two", email: "user2@beatrix.test", role: "user" }
  ];
  for (const userData of users) {
    const existing = await User.findOne({ email: userData.email }).select("+passwordHash");
    if (!existing) {
      await User.create({ ...userData, passwordHash: demoPassword });
    }
  }

  const movieCount = await Movie.countDocuments();

  if (movieCount === 0) {
    await Movie.insertMany(sampleMovies);
    console.log("Sample movies seeded");
  } else {
    await Movie.bulkWrite(
      sampleMovies.map((movie) => ({
        updateOne: {
          filter: { slug: movie.slug },
          update: {
            $set: {
              title: movie.title,
              shortTitle: movie.shortTitle,
              description: movie.description,
              trailerVideoId: movie.trailerVideoId,
              poster: movie.poster,
              genres: movie.genres,
              runtime: movie.runtime,
              rating: movie.rating,
              year: movie.year,
              status: movie.status,
              releaseDate: movie.releaseDate,
              price: movie.price
            },
            $setOnInsert: { slug: movie.slug }
          },
          upsert: true
        }
      }))
    );
  }

  const showtimeCount = await Showtime.countDocuments();

  if (showtimeCount > 0) {
    return;
  }

  const movieSlugs = sampleShowtimes.map((showtime) => showtime.movieSlug);
  const movies = await Movie.find({ slug: { $in: movieSlugs } }).select("_id slug");
  const movieBySlug = new Map(movies.map((movie) => [movie.slug, movie._id]));
  const showtimeDocs = sampleShowtimes
    .filter((showtime) => movieBySlug.has(showtime.movieSlug))
    .map((showtime) => ({
      movie: movieBySlug.get(showtime.movieSlug),
      date: dateOffset(showtime.daysFromNow),
      time: showtime.time,
      studio: showtime.studio,
      price: showtime.price,
      bookedSeats: showtime.bookedSeats
    }));

  if (showtimeDocs.length) {
    await Showtime.insertMany(showtimeDocs);
    console.log("Sample showtimes seeded");
  }
}
