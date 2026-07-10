import { Router } from "express";
import { listShowtimesByMovie } from "../showtimes/showtime.controller.js";
import { createMovie, listMovies } from "./movie.controller.js";

const router = Router();

router.get("/:movieId/showtimes", listShowtimesByMovie);
router.get("/", listMovies);
router.post("/", createMovie);

export default router;
