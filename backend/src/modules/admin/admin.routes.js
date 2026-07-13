import { Router } from "express";
import { listAllBookings, getAdminStats } from "./admin.controller.js";
import { authenticate, requireAdmin } from "../auth/auth.middleware.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/stats", getAdminStats);
router.get("/bookings", listAllBookings);

export default router;
