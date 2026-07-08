import { Router } from "express";
import { Booking } from "../models/Booking.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("movie").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
