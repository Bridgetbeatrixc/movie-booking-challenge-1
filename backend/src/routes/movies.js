import { Router } from "express";
import { listShowtimesByMovie } from "../controllers/showtimeController.js";
import { Movie } from "../models/Movie.js";

const router = Router();

router.get("/:movieId/showtimes", listShowtimesByMovie);

router.get("/", async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ status: 1, year: -1 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
});

export default router;
