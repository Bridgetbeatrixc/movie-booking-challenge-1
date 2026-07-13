import { Router } from "express";
import {
  checkoutBooking,
  cancelBooking,
  downloadTicketPdf,
  getBookingById,
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

router.use(authenticate);
router.get("/occupied", listOccupiedSeats);
router.get("/me", listBookings);
router.get("/", listBookings);
router.get("/occupied", listOccupiedSeats);
router.post("/", authenticate, checkoutBooking);
router.post("/checkout", authenticate, checkoutBooking);
router.patch("/:id/mock-paid", authenticate, requireAdmin, markBookingPaid);
router.post("/:id/email", authenticate, sendTicketEmailHandler);
router.post("/:id/mock-email", authenticate, sendTicketEmailHandler);
router.get("/:id/ticket.pdf", authenticate, downloadTicketPdf);
router.get("/:id", authenticate, getBookingById);
router.delete("/:id", authenticate, cancelBooking);

export default router;
