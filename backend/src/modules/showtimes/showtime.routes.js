import { Router } from "express";
import { authenticate, requireAdmin } from "../auth/auth.middleware.js";
import {
  createShowtime,
  deleteShowtime,
  getShowtimeById,
  getShowtimeSeats,
  listShowtimes,
  updateShowtime
} from "./showtime.controller.js";

const router = Router();

router.get("/", listShowtimes);
router.get("/:id/seats", getShowtimeSeats);
router.get("/:id", getShowtimeById);
router.post("/", authenticate, requireAdmin, createShowtime);
router.put("/:id", authenticate, requireAdmin, updateShowtime);
router.delete("/:id", authenticate, requireAdmin, deleteShowtime);

export default router;
