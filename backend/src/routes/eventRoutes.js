import express from "express";
import {
  createEvent,
  getEvent,
  getResults,
  submitAvailability,
  getMeta,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/:shortId", getEvent);
router.post("/:shortId/respond", submitAvailability);
router.get("/:shortId/results", getResults);
router.get("/:shortId/meta", getMeta);

export default router;

