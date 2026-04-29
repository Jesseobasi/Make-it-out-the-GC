import express from "express";
import {
  getCurrentUser,
  getMyEvents,
  loginWithEmail,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginWithEmail);
router.get("/me", requireAuth, getCurrentUser);
router.get("/my-events", requireAuth, getMyEvents);

export default router;
