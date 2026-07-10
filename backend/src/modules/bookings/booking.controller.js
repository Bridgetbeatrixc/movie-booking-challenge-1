import { Movie } from "../movies/movie.model.js";
import { createTicketPdf, ensureTicket, sendTicketEmail } from "../../services/ticketService.js";
import { createMockXenditInvoice } from "../../services/xenditMock.js";
import { Booking } from "./booking.model.js";

const defaultCinema = "Beatrix Movieplex - Central World";
const defaultShowtime = "2026-06-21T13:30:00.000Z";

export async function listBookings(_req, res, next) {
  try {
    const bookings = await Booking.find().populate("movie").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function listOccupiedSeats(req, res, next) {
  try {
    const { movieId, cinema = defaultCinema, showtime = defaultShowtime } = req.query;
    const query = {
      cinema,
      showtime: new Date(showtime),
      paymentStatus: { $in: ["pending", "paid"] }
    };

    if (movieId) {
      query.movie = movieId;
    }

    const bookings = await Booking.find(query).select("seats");
    const occupiedSeats = [...new Set(bookings.flatMap((booking) => booking.seats))].sort();

    res.json({ occupiedSeats });
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

export async function checkoutBooking(req, res, next) {
  try {
    const { movieId, movieTitle, moviePoster, cinema, showtime, seats = [] } = req.body;

    if (!seats.length) {
      return res.status(400).json({ message: "Choose at least one seat before payment." });
    }

    const movie = movieId ? await Movie.findById(movieId) : null;
    const ticketPrice = movie?.price || 35000;
    const totalPrice = seats.length * ticketPrice;
    const bookingShowtime = showtime ? new Date(showtime) : new Date(defaultShowtime);
    const bookingCinema = cinema || defaultCinema;
    const seatConflict = await Booking.findOne({
      movie: movie?._id,
      cinema: bookingCinema,
      showtime: bookingShowtime,
      paymentStatus: { $in: ["pending", "paid"] },
      seats: { $in: seats }
    });

    if (seatConflict) {
      return res.status(409).json({
        message: "One or more selected seats are already booked. Please choose another seat."
      });
    }

    const booking = await Booking.create({
      movie: movie?._id,
      movieTitle: movie?.title || movieTitle,
      moviePoster: movie?.poster || moviePoster,
      cinema: bookingCinema,
      showtime: bookingShowtime,
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
}

export async function markBookingPaid(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate("movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.payment.status = "PAID";
    await ensureTicket(booking);
    await booking.save();

    res.json(booking);
  } catch (error) {
    next(error);
  }
}

export async function sendTicketEmailHandler(req, res, next) {
  try {
    const { email = "guest@example.com" } = req.body;
    const booking = await Booking.findById(req.params.id).populate("movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Ticket can only be sent after payment." });
    }

    await ensureTicket(booking);
    const emailInfo = await sendTicketEmail(booking, email);

    booking.ticket = {
      ...(booking.ticket.toObject?.() || booking.ticket),
      emailSent: true,
      emailTo: email,
      emailSentAt: new Date()
    };
    await booking.save();

    res.json({
      message: `Ticket email sent to ${email}`,
      previewUrl: emailInfo.previewUrl,
      messageId: emailInfo.messageId,
      booking
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadTicketPdf(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Ticket PDF is available after payment." });
    }

    await ensureTicket(booking);
    booking.ticket.pdfDownloadedAt = new Date();
    await booking.save();

    const pdf = await createTicketPdf(booking);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="beatrix-ticket-${booking.ticket.ticketCode}.pdf"`);
    res.send(pdf);
  } catch (error) {
    next(error);
  }
}
