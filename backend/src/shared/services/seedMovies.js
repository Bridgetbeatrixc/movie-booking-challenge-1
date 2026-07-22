import { sampleMovies } from "../../data/sampleMovies.js";
import { sampleShowtimes } from "../../data/sampleShowtimes.js";
import { Movie } from "../../modules/movies/movie.model.js";
import { Showtime } from "../../modules/showtimes/showtime.model.js";
import { User } from "../../modules/auth/auth.model.js";
import { Hall } from "../../modules/halls/hall.model.js";
import { Booking } from "../../modules/bookings/booking.model.js";
import { fetchOmdbMovies } from "./omdbSeed.js";

function dateOffset(days) {
  const date = new Date(process.env.SEED_BASE_DATE || "2026-08-01T00:00:00.000Z");
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function seedMovies() {
  let seedMovies = sampleMovies;

  if (process.env.OMDB_API_KEY) {
    try {
      const omdbMovies = await fetchOmdbMovies(process.env.OMDB_API_KEY, 5);

      if (omdbMovies.length) {
        seedMovies = omdbMovies;
      }
    } catch (error) {
      console.warn(`OMDb seed failed, using local sample movies instead: ${error.message}`);
    }
  } else {
    console.warn("OMDB_API_KEY is not set. Using local sample movies for seed data.");
  }

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

  await Booking.deleteMany({});
  await Showtime.deleteMany({});
  await Movie.deleteMany({});
  await Hall.deleteMany({});

  const halls = [
    { name: "Studio 1", type: "Regular", seats: 48, status: "Open" },
    { name: "Studio 2", type: "Premium", seats: 48, status: "Open" },
    { name: "Hall IMAX", type: "IMAX", seats: 48, status: "Open" },
    { name: "Studio Horror", type: "Themed", seats: 48, status: "Open" },
    { name: "Studio 4", type: "Regular", seats: 48, status: "Open" }
  ];
  await Hall.bulkWrite(halls.map((hall) => ({
    updateOne: { filter: { name: hall.name }, update: { $set: hall }, upsert: true }
  })));

  await Movie.insertMany(seedMovies);
  const movies = await Movie.find().select("_id slug").sort({ year: -1, title: 1 });
  const movieBySlug = new Map(movies.map((movie) => [movie.slug, movie._id]));
  const configuredShowtimes = sampleShowtimes.map((showtime) => ({
    movie: movieBySlug.get(showtime.movieSlug), date: dateOffset(showtime.daysFromNow),
    time: showtime.time, studio: showtime.studio, price: showtime.price, bookedSeats: showtime.bookedSeats
  }));
  const generatedShowtimes = movies.flatMap((movie, index) => {
    const firstDayOffset = (index % 7) + 1;

    return [0, 1, 2].flatMap((extraDay) => {
      const date = dateOffset(firstDayOffset + extraDay);
      const premiumStudio = (index + extraDay) % 3 === 0 ? "Hall IMAX" : "Studio 2";

      return [
        { movie: movie._id, date, time: "16:00", studio: "Studio 1", price: 35000, bookedSeats: [] },
        {
          movie: movie._id,
          date,
          time: "20:00",
          studio: premiumStudio,
          price: premiumStudio === "Hall IMAX" ? 45000 : 40000,
          bookedSeats: []
        }
      ];
    });
  });
  const showtimeDocs = [...configuredShowtimes, ...generatedShowtimes].filter((showtime) => showtime.movie);
  await Showtime.bulkWrite(showtimeDocs.map((showtime) => ({
    updateOne: {
      filter: { movie: showtime.movie, date: showtime.date, time: showtime.time, studio: showtime.studio },
      update: { $setOnInsert: showtime }, upsert: true
    }
  })));
  console.log(`Seeded ${movies.length} movies, ${halls.length} halls, and showtimes for the catalog.`);
}
