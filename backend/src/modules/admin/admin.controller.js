import { Booking } from "../bookings/booking.model.js";
import { Movie } from "../movies/movie.model.js";
import { Showtime } from "../showtimes/showtime.model.js";
import { User } from "../auth/auth.model.js";

export async function getAdminStats(_req, res, next) {
  try {
    const [movies, showtimes, bookings, users] = await Promise.all([
      Movie.countDocuments(),
      Showtime.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments()
    ]);
    res.json({ movies, showtimes, bookings, users });
  } catch (error) {
    next(error);
  }
}

export async function listAllBookings(_req, res, next) {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("movie", "title poster")
      .populate("showtimeId", "date time studio price")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}
