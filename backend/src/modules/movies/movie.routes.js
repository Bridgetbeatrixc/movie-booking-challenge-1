import { Router } from "express";
import { listShowtimesByMovie } from "../showtimes/showtime.controller.js";
import {
  createMovie,
  deleteMovie,
  getMovieById,
  listMovieGenres,
  listMovies,
  updateMovie
} from "./movie.controller.js";

const router = Router();

router.get("/:movieId/showtimes", listShowtimesByMovie);
router.get("/", listMovies);
router.get("/genres", listMovieGenres);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
