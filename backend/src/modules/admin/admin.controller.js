import { Booking } from "../bookings/booking.model.js";
import { Movie } from "../movies/movie.model.js";
import { Showtime } from "../showtimes/showtime.model.js";
import { User } from "../auth/auth.model.js";

export async function getAdminStats(_req, res, next) {
  try {
    const [totalMovies, totalShowtimes, totalBookings, totalUsers] = await Promise.all([
      Movie.countDocuments(),
      Showtime.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments()
    ]);
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);

    const totalRevenue = (revenueAgg[0] && revenueAgg[0].totalRevenue) || 0;

    res.json({ totalMovies, totalShowtimes, totalBookings, totalUsers, totalRevenue });
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
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}
