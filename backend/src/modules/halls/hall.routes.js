import { Router } from "express";
import {
  createHall,
  deleteHall,
  getHallById,
  listHalls,
  updateHall
} from "./hall.controller.js";
import { authenticate, requireAdmin } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", listHalls);
router.get("/:id", getHallById);
router.post("/", authenticate, requireAdmin, createHall);
router.put("/:id", authenticate, requireAdmin, updateHall);
router.delete("/:id", authenticate, requireAdmin, deleteHall);

export default router;
