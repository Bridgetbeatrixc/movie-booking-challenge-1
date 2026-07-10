import { Movie } from "./movie.model.js";

export async function listMovies(_req, res, next) {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
}

export async function createMovie(req, res, next) {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
}
