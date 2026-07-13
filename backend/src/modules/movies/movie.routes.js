import { Router } from "express";
import { listShowtimesByMovie } from "../showtimes/showtime.controller.js";
import { authenticate, requireAdmin } from "../auth/auth.middleware.js";
import {
  createMovie,
  deleteMovie,
  getMovieById,
  listMovieGenres,
  listMovies,
  updateMovie
} from "./movie.controller.js";
import { authenticate, requireAdmin } from "../auth/auth.middleware.js";

const router = Router();

router.get("/:movieId/showtimes", listShowtimesByMovie);
router.get("/", listMovies);
router.get("/genres", listMovieGenres);
router.get("/:id", getMovieById);
router.post("/", authenticate, requireAdmin, createMovie);
router.put("/:id", authenticate, requireAdmin, updateMovie);
router.delete("/:id", authenticate, requireAdmin, deleteMovie);

export default router;
