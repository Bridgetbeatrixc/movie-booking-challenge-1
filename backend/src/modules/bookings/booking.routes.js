import { Router } from "express";
import { createBooking, listBookings } from "./booking.controller.js";

const router = Router();

router.get("/", listBookings);
router.post("/", createBooking);

export default router;
