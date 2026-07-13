import { Router } from "express";
import {
  checkoutBooking,
  cancelBooking,
  downloadTicketPdf,
  listBookings,
  listOccupiedSeats,
  markBookingPaid,
  sendTicketEmailHandler
} from "./booking.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/occupied", listOccupiedSeats);
router.get("/me", listBookings);
router.get("/", listBookings);
router.post("/", checkoutBooking);
router.post("/checkout", checkoutBooking);
router.patch("/:id/mock-paid", markBookingPaid);
router.post("/:id/email", sendTicketEmailHandler);
router.post("/:id/mock-email", sendTicketEmailHandler);
router.get("/:id/ticket.pdf", downloadTicketPdf);
router.delete("/:id", cancelBooking);

export default router;
