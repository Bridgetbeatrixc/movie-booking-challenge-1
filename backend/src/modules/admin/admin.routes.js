import { Router } from "express";
import { listAllBookings, getAdminStats } from "./admin.controller.js";

const router = Router();

router.get("/stats", getAdminStats);
router.get("/bookings", listAllBookings);

export default router;
