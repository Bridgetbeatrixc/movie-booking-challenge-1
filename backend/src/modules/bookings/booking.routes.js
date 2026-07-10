import { Router } from "express";
import {
  checkoutBooking,
  createBooking,
  downloadTicketPdf,
  listBookings,
  listOccupiedSeats,
  markBookingPaid,
  sendTicketEmailHandler
} from "./booking.controller.js";

const router = Router();

router.get("/occupied", listOccupiedSeats);
router.get("/", listBookings);
router.post("/", createBooking);
router.post("/checkout", checkoutBooking);
router.patch("/:id/mock-paid", markBookingPaid);
router.post("/:id/email", sendTicketEmailHandler);
router.post("/:id/mock-email", sendTicketEmailHandler);
router.get("/:id/ticket.pdf", downloadTicketPdf);

export default router;
