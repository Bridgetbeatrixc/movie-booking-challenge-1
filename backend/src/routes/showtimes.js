import { Router } from "express";
import {
  createShowtime,
  deleteShowtime,
  getShowtimeById,
  getShowtimeSeats,
  updateShowtime
} from "../controllers/showtimeController.js";

const router = Router();

router.get("/:id/seats", getShowtimeSeats);
router.get("/:id", getShowtimeById);
router.post("/", createShowtime);
router.put("/:id", updateShowtime);
router.delete("/:id", deleteShowtime);

export default router;
