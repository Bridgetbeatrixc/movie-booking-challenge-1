import { Movie } from "./movie.model.js";

export async function listMovies(_req, res, next) {
  try {
    const movies = await Movie.find().sort({ status: 1, year: -1 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
}

export async function getMovieById(req, res, next) {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
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
