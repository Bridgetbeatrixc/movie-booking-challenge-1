import { Router } from "express";
import { getCurrentUser, login, logout, register } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getCurrentUser);

export default router;
