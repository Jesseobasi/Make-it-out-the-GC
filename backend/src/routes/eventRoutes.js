import express from "express";
import {
  createEvent,
  getEvent,
  getResults,
  submitAvailability,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/:shortId", getEvent);
router.post("/:shortId/respond", submitAvailability);
router.get("/:shortId/results", getResults);

export default router;

