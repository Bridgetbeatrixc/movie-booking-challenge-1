import { Movie } from "../movies/movie.model.js";
import { Showtime } from "../showtimes/showtime.model.js";
import { createTicketPdf, ensureTicket, sendTicketEmail } from "../../shared/services/ticketService.js";
import { createMockXenditInvoice } from "../../shared/services/xenditMock.js";
import { Booking } from "./booking.model.js";
import { User } from "../auth/auth.model.js";

const defaultCinema = "Beatrix Movieplex - Central World";

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
    const { movieId, cinema = defaultCinema, showtime } = req.query;
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
    // Allow creation by admin or internal processes. If user is authenticated, attach owner.
    const data = { ...req.body };
    if (req.user) {
      data.user = req.user._id;
    }

    const booking = await Booking.create(data);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

export async function checkoutBooking(req, res, next) {
  try {
    const { movieId, movieTitle, moviePoster, cinema, showtimeId, seats = [] } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Authentication required to checkout." });
    }

    if (!seats.length) {
      return res.status(400).json({ message: "Choose at least one seat before payment." });
    }

    // Resolve showtime
    const showtime = showtimeId ? await Showtime.findById(showtimeId) : null;

    if (!showtime) {
      return res.status(400).json({ message: "Showtime not found or invalid showtimeId." });
    }

    const ticketPrice = showtime.price;
    const totalPrice = seats.length * ticketPrice;
    const bookingCinema = cinema || defaultCinema;

    // Atomically add seats to showtime.bookedSeats if they are all available
    const updatedShowtime = await Showtime.findOneAndUpdate(
      { _id: showtime._id, bookedSeats: { $nin: seats } },
      { $push: { bookedSeats: { $each: seats } } },
      { new: true }
    );

    if (!updatedShowtime) {
      // Determine which seats are unavailable
      const current = await Showtime.findById(showtime._id).select("bookedSeats");
      const unavailableSeats = (current?.bookedSeats || []).filter((s) => seats.includes(s));
      return res.status(409).json({
        message: "One or more selected seats are already booked. Please choose another seat.",
        unavailableSeats
      });
    }

    const movie = showtime.movie ? await Movie.findById(showtime.movie) : movieId ? await Movie.findById(movieId) : null;

    const booking = await Booking.create({
      user: req.user._id,
      movie: movie?._id,
      movieTitle: movie?.title || movieTitle,
      moviePoster: movie?.poster || moviePoster,
      cinema: bookingCinema,
      showtime: showtime._id,
      seats,
      totalPrice
    });

    const invoice = createMockXenditInvoice({ bookingId: booking._id, amount: totalPrice, movieTitle: booking.movieTitle });

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

export async function getMyBookings(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const bookings = await Booking.find({ user: req.user._id }).populate("movie showtime").sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate("movie showtime user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only owner or admin can view
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (String(booking.user?._id || booking.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this booking." });
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
}

export async function deleteBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const isOwner = String(booking.user) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this booking." });
    }

    // Release seats from showtime atomically
    if (booking.showtime) {
      await Showtime.updateOne({ _id: booking.showtime }, { $pull: { bookedSeats: { $in: booking.seats } } });
    }

    await booking.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
