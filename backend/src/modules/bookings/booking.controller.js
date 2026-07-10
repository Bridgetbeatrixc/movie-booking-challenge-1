import { Booking } from "./booking.model.js";

export async function listBookings(_req, res, next) {
  try {
    const bookings = await Booking.find().populate("movie").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req, res, next) {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}
