import express from "express";
import { Event } from "../models/Event.js";
import { calculateResults } from "../utils/results.js";
import { generateEventId } from "../utils/eventId.js";
import {
  validateEventPayload,
  validateResponsePayload,
} from "../utils/validation.js";

const router = express.Router();

function toEventResponse(event) {
  return {
    id: event.eventId,
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    responses: event.responses.map((response) => ({
      name: response.name,
      availability: Object.fromEntries(response.availability),
    })),
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

router.post("/", async (req, res, next) => {
  try {
    const error = validateEventPayload(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    let eventId = generateEventId();
    while (await Event.exists({ eventId })) {
      eventId = generateEventId();
    }

    const event = await Event.create({
      eventId,
      title: req.body.title.trim(),
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    return res.status(201).json({
      event: toEventResponse(event),
      shareUrl: `/event/${event.eventId}`,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.json({ event: toEventResponse(event) });
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/respond", async (req, res, next) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const error = validateResponsePayload(event, req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const normalizedName = req.body.name.trim().toLowerCase();
    const existingIndex = event.responses.findIndex(
      (response) => response.name.trim().toLowerCase() === normalizedName
    );

    const nextResponse = {
      name: req.body.name.trim(),
      availability: req.body.availability,
    };

    if (existingIndex >= 0) {
      event.responses[existingIndex] = nextResponse;
    } else {
      event.responses.push(nextResponse);
    }

    await event.save();

    return res.status(201).json({
      message: "Availability saved.",
      event: toEventResponse(event),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/results", async (req, res, next) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.json({
      event: toEventResponse(event),
      results: calculateResults(event),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;

