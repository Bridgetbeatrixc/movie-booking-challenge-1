import { Router } from "express";
import {
  createHall,
  deleteHall,
  getHallById,
  listHalls,
  updateHall
} from "./hall.controller.js";

const router = Router();

router.get("/", listHalls);
router.get("/:id", getHallById);
router.post("/", createHall);
router.put("/:id", updateHall);
router.delete("/:id", deleteHall);

export default router;
