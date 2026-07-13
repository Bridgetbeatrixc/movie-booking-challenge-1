import { Movie } from "../movies/movie.model.js";
import { Showtime } from "../showtimes/showtime.model.js";
import { validateSeatSelection } from "../showtimes/seatValidation.js";
import { createTicketPdf, ensureTicket, sendTicketEmail } from "../../shared/services/ticketService.js";
import { createMockXenditInvoice } from "../../shared/services/xenditMock.js";
import { Booking } from "./booking.model.js";
import { User } from "../auth/auth.model.js";

const defaultCinema = "Beatrix Movieplex - Central World";

async function findAuthorizedBooking(req, id) {
  const filter = req.user.role === "admin" ? { _id: id } : { _id: id, user: req.user._id };
  return Booking.findOne(filter).populate("movie showtimeId");
}

export async function listBookings(req, res, next) {
  try {
    const filter = { user: req.user._id };
    const bookings = await Booking.find(filter).populate("movie showtimeId").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const booking = await findAuthorizedBooking(req, req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    res.json(booking);
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
      paymentStatus: { $in: ["pending", "paid"] }
    };

    if (movieId) {
      query.movie = movieId;
    }
    if (showtime) {
      query.showtime = showtime;
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
    const { showtimeId, cinema, seats = [] } = req.body;

    if (!Array.isArray(seats) || !seats.length) {
      return res.status(400).json({ message: "Choose at least one seat before payment." });
    }
    const seatValidation = validateSeatSelection(seats);
    if (!seatValidation.isValid) {
      return res.status(400).json({
        message: "Seat selection is invalid.",
        invalidSeats: seatValidation.invalidSeats,
        duplicateSeats: seatValidation.duplicateSeats
      });
    }
      });
    }
    const selectedSeats = seatValidation.seats;

    const selectedShowtime = showtimeId ? await Showtime.findById(showtimeId).populate("movie") : null;
    if (!selectedShowtime) return res.status(400).json({ message: "A valid showtimeId is required." });

    const movie = selectedShowtime.movie;
    const selectedSeats = seatValidation.seats;
    const totalPrice = selectedSeats.length * selectedShowtime.price;
    const bookingShowtime = new Date(`${selectedShowtime.date}T${selectedShowtime.time}:00.000Z`);
    const bookingCinema = cinema || defaultCinema;
    const reservedShowtime = await Showtime.findOneAndUpdate(
      { _id: selectedShowtime._id, bookedSeats: { $nin: selectedSeats } },
      { $addToSet: { bookedSeats: { $each: selectedSeats } } },
      { new: true }
    );
    if (!reservedShowtime) {
      const current = await Showtime.findById(selectedShowtime._id).select("bookedSeats");
      const unavailableSeats = selectedSeats.filter((seat) => current?.bookedSeats?.includes(seat));
      return res.status(409).json({ message: "One or more selected seats are no longer available.", unavailableSeats });
    }

    const booking = await Booking.create({
      user: req.user._id,
      movie: movie?._id,
      cinema: bookingCinema,
      showtimeId: selectedShowtime._id,
      seats: selectedSeats,
      totalPrice
    });

    const invoice = createMockXenditInvoice({ bookingId: booking._id, amount: totalPrice, movieTitle: movie?.title });

    let booking;
    try {
      booking = await Booking.create({
        user: req.user._id,
        movie: movie._id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        cinema: bookingCinema,
        showtime: bookingShowtime,
        showtimeId: selectedShowtime._id,
        seats: selectedSeats,
        totalPrice
      });
    } catch (error) {
      await Showtime.findByIdAndUpdate(selectedShowtime._id, { $pull: { bookedSeats: { $in: selectedSeats } } });
      throw error;
    }

    let invoice;
    try {
      invoice = createMockXenditInvoice({
        bookingId: booking._id,
        amount: totalPrice,
        movieTitle: booking.movieTitle
      });

      booking.payment = invoice;
      await booking.save();
    } catch (error) {
      await Promise.all([
        Showtime.findByIdAndUpdate(selectedShowtime._id, { $pull: { bookedSeats: { $in: selectedSeats } } }),
        Booking.findByIdAndDelete(booking._id)
      ]);
      throw error;
    }

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
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (!req.user) return res.status(401).json({ message: "Authentication required." });
    const isOwner = String(booking.user) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Not authorized." });
    if (booking.status === "cancelled") return res.status(409).json({ message: "Booking is already cancelled." });
    await Showtime.findByIdAndUpdate(booking.showtimeId?._id || booking.showtimeId, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });
    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled and seats released." });
  } catch (error) {
    next(error);
  }
}
