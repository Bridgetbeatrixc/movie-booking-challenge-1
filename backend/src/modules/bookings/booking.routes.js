import { Router } from "express";
import {
  checkoutBooking,
  createBooking,
  downloadTicketPdf,
  listBookings,
  listOccupiedSeats,
  markBookingPaid,
  sendTicketEmailHandler,
  getMyBookings,
  getBookingById,
  deleteBooking
} from "./booking.controller.js";
import { authenticate, requireAdmin } from "../auth/auth.middleware.js";

const router = Router();

router.get("/occupied", listOccupiedSeats);
router.get("/", listBookings);
router.get("/me", authenticate, getMyBookings);
router.post("/", authenticate, createBooking);
router.post("/checkout", authenticate, checkoutBooking);
router.patch("/:id/mock-paid", authenticate, requireAdmin, markBookingPaid);
router.post("/:id/email", authenticate, sendTicketEmailHandler);
router.post("/:id/mock-email", authenticate, sendTicketEmailHandler);
router.get("/:id/ticket.pdf", authenticate, downloadTicketPdf);
router.get("/:id", authenticate, getBookingById);
router.delete("/:id", authenticate, deleteBooking);

export default router;
