import { Router } from "express";
import { listShowtimesByMovie } from "../controllers/showtimeController.js";
import { Movie } from "../models/Movie.js";

const router = Router();

router.get("/:movieId/showtimes", listShowtimesByMovie);

router.get("/", async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
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
