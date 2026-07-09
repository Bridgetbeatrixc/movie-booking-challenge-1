import { Router } from "express";
import { Booking } from "../models/Booking.js";
import { Movie } from "../models/Movie.js";
import { createMockXenditInvoice } from "../services/xenditMock.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("movie").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

router.post("/checkout", async (req, res, next) => {
  try {
    const { movieId, movieTitle, moviePoster, cinema, showtime, seats = [] } = req.body;

    if (!seats.length) {
      return res.status(400).json({ message: "Choose at least one seat before payment." });
    }

    const movie = movieId ? await Movie.findById(movieId) : null;
    const ticketPrice = movie?.price || 35000;
    const totalPrice = seats.length * ticketPrice;

    const booking = await Booking.create({
      movie: movie?._id,
      movieTitle: movie?.title || movieTitle,
      moviePoster: movie?.poster || moviePoster,
      cinema: cinema || "Beatrix Movieplex - Central World",
      showtime: showtime ? new Date(showtime) : new Date("2026-06-21T13:30:00.000Z"),
      seats,
      totalPrice
    });

    const invoice = createMockXenditInvoice({
      bookingId: booking._id,
      amount: totalPrice,
      movieTitle: booking.movieTitle
    });

    booking.payment = invoice;
    await booking.save();

    res.status(201).json({ booking, payment: invoice });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/mock-paid", async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "paid",
        "payment.status": "PAID"
      },
      { new: true }
    ).populate("movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
