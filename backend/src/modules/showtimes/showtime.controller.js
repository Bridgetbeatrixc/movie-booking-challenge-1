import mongoose from "mongoose";
import { Movie } from "../movies/movie.model.js";
import { Showtime } from "./showtime.model.js";
import {
  DEFAULT_SEAT_LAYOUT,
  buildSeatAvailability,
  validateSeatSelection
} from "./seatValidation.js";

const moviePopulateFields = "title shortTitle slug poster description genres runtime rating year status releaseDate price";

function createError(status, message, details) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}

function assertObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, `${label} is invalid.`);
  }
}

async function assertMovieExists(movieId) {
  const movieExists = await Movie.exists({ _id: movieId });

  if (!movieExists) {
    throw createError(404, "Movie not found.");
  }
}

function validateShowtimePayload(body, { partial = false } = {}) {
  const payload = {};
  const errors = {};
  const movieId = body.movieId || body.movie;

  if (movieId !== undefined) {
    assertObjectId(movieId, "Movie ID");
    payload.movie = movieId;
  } else if (!partial) {
    errors.movieId = "Movie ID is required.";
  }

  if (body.date !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      errors.date = "Date must use YYYY-MM-DD format.";
    } else {
      payload.date = body.date;
    }
  } else if (!partial) {
    errors.date = "Date is required.";
  }

  if (body.time !== undefined) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time)) {
      errors.time = "Time must use HH:mm 24-hour format.";
    } else {
      payload.time = body.time;
    }
  } else if (!partial) {
    errors.time = "Time is required.";
  }

  if (body.studio !== undefined) {
    const studio = String(body.studio).trim();

    if (!studio) {
      errors.studio = "Studio is required.";
    } else {
      payload.studio = studio;
    }
  } else if (!partial) {
    errors.studio = "Studio is required.";
  }

  if (body.price !== undefined) {
    const price = Number(body.price);

    if (!Number.isFinite(price) || price <= 0) {
      errors.price = "Price must be greater than 0.";
    } else {
      payload.price = price;
    }
  } else if (!partial) {
    errors.price = "Price is required.";
  }

  if (body.bookedSeats !== undefined) {
    if (!Array.isArray(body.bookedSeats)) {
      errors.bookedSeats = "Booked seats must be an array.";
    } else {
      const seatValidation = validateSeatSelection(body.bookedSeats);

      if (!seatValidation.isValid) {
        errors.bookedSeats = {
          invalidSeats: seatValidation.invalidSeats,
          duplicateSeats: seatValidation.duplicateSeats
        };
      } else {
        payload.bookedSeats = seatValidation.seats;
      }
    }
  } else if (!partial) {
    payload.bookedSeats = [];
  }

  if (Object.keys(errors).length > 0) {
    throw createError(400, "Showtime validation failed.", errors);
  }

  return payload;
}

function buildSeatStats(bookedSeats = [], layout = DEFAULT_SEAT_LAYOUT) {
  const totalSeats = layout.rows.length * layout.seatsPerRow;
  const bookedSeatsCount = Array.isArray(bookedSeats) ? bookedSeats.length : 0;
  const availableSeats = Math.max(totalSeats - bookedSeatsCount, 0);

  return {
    totalSeats,
    bookedSeatsCount,
    availableSeats,
    seatsSummary: `${bookedSeatsCount} / ${availableSeats}`
  };
}

function formatShowtime(showtime) {
  const data = showtime.toObject();
  const seatStats = buildSeatStats(data.bookedSeats);

  return {
    id: data._id,
    movieId: data.movie?._id || data.movie,
    movie: data.movie,
    date: data.date,
    time: data.time,
    studio: data.studio,
    price: data.price,
    bookedSeats: data.bookedSeats,
    bookedSeatsCount: seatStats.bookedSeatsCount,
    availableSeats: seatStats.availableSeats,
    seatsSummary: seatStats.seatsSummary,
    totalSeats: seatStats.totalSeats,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function toPositiveInt(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}

export async function listShowtimes(req, res, next) {
  try {
    const filter = {};

    if (req.query.movieId) {
      assertObjectId(req.query.movieId, "Movie ID");
      filter.movie = req.query.movieId;
    }

    if (req.query.date) {
      filter.date = req.query.date;
    } else if (req.query.from) {
      filter.date = { $gte: req.query.from };
    }

    if (req.query.studio) {
      filter.studio = new RegExp(req.query.studio, "i");
    }

    const page = toPositiveInt(req.query.page, 1, 1000);
    const limit = toPositiveInt(req.query.limit, 20, 100);
    const skip = (page - 1) * limit;

    const [showtimes, total] = await Promise.all([
      Showtime.find(filter)
        .populate("movie", moviePopulateFields)
        .sort({ date: 1, time: 1, studio: 1 })
        .skip(skip)
        .limit(limit),
      Showtime.countDocuments(filter)
    ]);

    res.json({
      showtimes: showtimes.map(formatShowtime),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function listShowtimesByMovie(req, res, next) {
  try {
    const { movieId } = req.params;
    assertObjectId(movieId, "Movie ID");
    await assertMovieExists(movieId);

    const showtimes = await Showtime.find({ movie: movieId })
      .populate("movie", moviePopulateFields)
      .sort({ date: 1, time: 1, studio: 1 });

    res.json(showtimes.map(formatShowtime));
  } catch (error) {
    next(error);
  }
}

export async function getShowtimeById(req, res, next) {
  try {
    const { id } = req.params;
    assertObjectId(id, "Showtime ID");

    const showtime = await Showtime.findById(id).populate("movie", moviePopulateFields);

    if (!showtime) {
      throw createError(404, "Showtime not found.");
    }

    res.json(formatShowtime(showtime));
  } catch (error) {
    next(error);
  }
}

export async function getShowtimeSeats(req, res, next) {
  try {
    const { id } = req.params;
    assertObjectId(id, "Showtime ID");

    const showtime = await Showtime.findById(id);

    if (!showtime) {
      throw createError(404, "Showtime not found.");
    }

    res.json({
      showtimeId: showtime._id,
      movieId: showtime.movie,
      layout: DEFAULT_SEAT_LAYOUT,
      bookedSeats: showtime.bookedSeats,
      availability: buildSeatAvailability(showtime.bookedSeats)
    });
  } catch (error) {
    next(error);
  }
}

export async function createShowtime(req, res, next) {
  try {
    const payload = validateShowtimePayload(req.body);
    await assertMovieExists(payload.movie);

    const showtime = await Showtime.create(payload);
    const populatedShowtime = await Showtime.findById(showtime._id).populate("movie", moviePopulateFields);

    res.status(201).json(formatShowtime(populatedShowtime));
  } catch (error) {
    next(error);
  }
}

export async function updateShowtime(req, res, next) {
  try {
    const { id } = req.params;
    assertObjectId(id, "Showtime ID");

    const payload = validateShowtimePayload(req.body, { partial: true });

    if (payload.movie) {
      await assertMovieExists(payload.movie);
    }

    const showtime = await Showtime.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    }).populate("movie", moviePopulateFields);

    if (!showtime) {
      throw createError(404, "Showtime not found.");
    }

    res.json(formatShowtime(showtime));
  } catch (error) {
    next(error);
  }
}

export async function deleteShowtime(req, res, next) {
  try {
    const { id } = req.params;
    assertObjectId(id, "Showtime ID");

    const showtime = await Showtime.findById(id);

    if (!showtime) {
      throw createError(404, "Showtime not found.");
    }

    if (showtime.bookedSeats.length > 0) {
      throw createError(409, "Showtime already has booked seats and cannot be deleted.");
    }

    await showtime.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
