import mongoose from "mongoose";
import { Showtime } from "../showtimes/showtime.model.js";
import { Movie } from "./movie.model.js";

const allowedStatuses = new Set(["showing", "coming-soon", "advance-sale"]);
const sortOptions = {
  newest: { year: -1, title: 1 },
  oldest: { year: 1, title: 1 },
  rating: { rating: -1, title: 1 },
  title: { title: 1 },
  status: { status: 1, year: -1, title: 1 }
};

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toPositiveInt(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}

function buildMovieFilter(query) {
  const filter = {};

  if (query.search || query.q) {
    const searchRegex = new RegExp(escapeRegex(query.search || query.q), "i");
    filter.$or = [{ title: searchRegex }, { shortTitle: searchRegex }, { description: searchRegex }];
  }

  if (query.genre) {
    filter.genres = new RegExp(`^${escapeRegex(query.genre)}$`, "i");
  }

  if (query.status && allowedStatuses.has(query.status)) {
    filter.status = query.status;
  }

  return filter;
}

function getMovieLookup(idOrSlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return { _id: idOrSlug };
  }

  return { slug: idOrSlug };
}

function makeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateMoviePayload(body, { partial = false } = {}) {
  const payload = {};
  const errors = {};
  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) errors.title = "Title is required.";
    else payload.title = title;
  } else if (!partial) errors.title = "Title is required.";

  if (body.genres !== undefined || body.genre !== undefined) {
    const rawGenres = body.genres ?? body.genre;
    const genres = (Array.isArray(rawGenres) ? rawGenres : String(rawGenres).split(/[,/]/))
      .map((genre) => String(genre).trim())
      .filter(Boolean);
    if (!genres.length) errors.genres = "At least one genre is required.";
    else payload.genres = genres;
  } else if (!partial) errors.genres = "At least one genre is required.";

  if (body.runtime !== undefined) {
    const runtime = String(body.runtime).trim();
    const minutes = Number.parseInt(runtime, 10);
    if (!runtime || !Number.isFinite(minutes) || minutes <= 0) errors.runtime = "Runtime must be positive.";
    else payload.runtime = runtime;
  } else if (!partial) errors.runtime = "Runtime is required.";

  ["poster", "description", "trailerVideoId", "shortTitle", "status"].forEach((field) => {
    if (body[field] !== undefined) payload[field] = body[field];
  });
  ["rating", "year", "price"].forEach((field) => {
    if (body[field] !== undefined) {
      const value = Number(body[field]);
      if (!Number.isFinite(value) || (field === "price" && value <= 0)) errors[field] = `${field} is invalid.`;
      else payload[field] = value;
    }
  });
  if (body.releaseDate !== undefined) payload.releaseDate = body.releaseDate;
  if (body.slug !== undefined) payload.slug = makeSlug(body.slug);
  if (Object.keys(errors).length) {
    const error = new Error("Movie validation failed.");
    error.status = 400;
    error.details = errors;
    throw error;
  }
  return payload;
}

export async function listMovies(req, res, next) {
  try {
    const filter = buildMovieFilter(req.query);
    const page = toPositiveInt(req.query.page, 1, 1000);
    const limit = toPositiveInt(req.query.limit, 8, 50);
    const sort = sortOptions[req.query.sort] || sortOptions.status;
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sort).skip(skip).limit(limit),
      Movie.countDocuments(filter)
    ]);

    res.json({
      movies,
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

export async function getMovieById(req, res, next) {
  try {
    const movie = await Movie.findOne(getMovieLookup(req.params.id));

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
}

export async function listMovieGenres(_req, res, next) {
  try {
    const genres = await Movie.distinct("genres");
    res.json(genres.filter(Boolean).sort((a, b) => a.localeCompare(b)));
  } catch (error) {
    next(error);
  }
}

export async function createMovie(req, res, next) {
  try {
    const payload = validateMoviePayload(req.body);
    payload.slug ||= makeSlug(payload.title);
    const movie = await Movie.create(payload);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
}

export async function updateMovie(req, res, next) {
  try {
    const payload = validateMoviePayload(req.body, { partial: true });
    if (payload.title && !payload.slug) payload.slug = makeSlug(payload.title);
    const movie = await Movie.findOneAndUpdate(getMovieLookup(req.params.id), payload, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
}

export async function deleteMovie(req, res, next) {
  try {
    const movie = await Movie.findOne(getMovieLookup(req.params.id));

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const showtimeCount = await Showtime.countDocuments({ movie: movie._id });

    if (showtimeCount > 0) {
      return res.status(409).json({
        message: "Movie still has showtimes. Delete the showtimes first.",
        showtimeCount
      });
    }

    await movie.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
