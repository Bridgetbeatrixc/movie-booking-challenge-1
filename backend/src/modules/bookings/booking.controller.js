import { Movie } from "../movies/movie.model.js";
import { Showtime } from "../showtimes/showtime.model.js";
import { createTicketPdf, ensureTicket, sendTicketEmail } from "../../shared/services/ticketService.js";
import { createMockXenditInvoice } from "../../shared/services/xenditMock.js";
import { Booking } from "./booking.model.js";

const defaultCinema = "Beatrix Movieplex - Central World";
const defaultShowtime = "2026-06-21T13:30:00.000Z";

async function findAuthorizedBooking(req, id) {
  const filter = req.user.role === "admin" ? { _id: id } : { _id: id, user: req.user._id };
  return Booking.findOne(filter).populate("movie showtimeId");
}

export async function listBookings(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const bookings = await Booking.find(filter).populate("movie showtimeId").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function listOccupiedSeats(req, res, next) {
  try {
    const { showtimeId, movieId, cinema = defaultCinema, showtime = defaultShowtime } = req.query;

    if (showtimeId) {
      const selectedShowtime = await Showtime.findById(showtimeId).select("bookedSeats");
      if (!selectedShowtime) return res.status(404).json({ message: "Showtime not found." });
      return res.json({ occupiedSeats: selectedShowtime.bookedSeats || [] });
    }
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
    return res.status(400).json({ message: "Use the validated checkout flow to create a booking." });
  } catch (error) {
    next(error);
  }
}

export async function checkoutBooking(req, res, next) {
  try {
    const { showtimeId, movieId, cinema, showtime, seats = [] } = req.body;

    if (!seats.length) {
      return res.status(400).json({ message: "Choose at least one seat before payment." });
    }

    let selectedShowtime = showtimeId ? await Showtime.findById(showtimeId).populate("movie") : null;
    if (!selectedShowtime && movieId && showtime) {
      const date = new Date(showtime);
      selectedShowtime = await Showtime.findOne({ movie: movieId, date: date.toISOString().slice(0, 10), time: date.toISOString().slice(11, 16) }).populate("movie");
    }
    if (!selectedShowtime) return res.status(400).json({ message: "A valid showtimeId is required." });

    const movie = selectedShowtime.movie;
    const totalPrice = seats.length * selectedShowtime.price;
    const bookingShowtime = new Date(`${selectedShowtime.date}T${selectedShowtime.time}:00.000Z`);
    const bookingCinema = cinema || defaultCinema;
    const reservedShowtime = await Showtime.findOneAndUpdate(
      { _id: selectedShowtime._id, bookedSeats: { $nin: seats } },
      { $addToSet: { bookedSeats: { $each: seats } } },
      { new: true }
    );
    if (!reservedShowtime) {
      const current = await Showtime.findById(selectedShowtime._id).select("bookedSeats");
      const unavailableSeats = seats.filter((seat) => current?.bookedSeats?.includes(seat));
      return res.status(409).json({ message: "One or more selected seats are no longer available.", unavailableSeats });
    }

    const booking = await Booking.create({
      user: req.user._id,
      movie: movie._id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      cinema: bookingCinema,
      showtime: bookingShowtime,
      showtimeId: selectedShowtime._id,
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
    const booking = await findAuthorizedBooking(req, req.params.id);

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
    const booking = await findAuthorizedBooking(req, req.params.id);

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
    const booking = await findAuthorizedBooking(req, req.params.id);

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

export async function cancelBooking(req, res, next) {
  try {
    const booking = await findAuthorizedBooking(req, req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    await Showtime.findByIdAndUpdate(booking.showtimeId?._id || booking.showtimeId, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });
    await booking.deleteOne();
    res.json({ message: "Booking cancelled and seats released." });
  } catch (error) {
    next(error);
  }
}
