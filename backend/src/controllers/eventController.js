import { Event } from "../models/Event.js";
import { createExpiryDate, refreshExpirationStatus } from "../utils/expiration.js";
import { generateShortId, generateUuid } from "../utils/idGenerator.js";
import { calculateResults } from "../utils/scoring.js";
import { sanitizeText } from "../utils/sanitize.js";
import {
  validateCreateEventPayload,
  validateResponsePayload,
} from "../utils/validation.js";

function buildPublicEvent(event) {
  return {
    id: event.id,
    shortId: event.shortId,
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    timezone: event.timezone,
    expectedParticipants: event.expectedParticipants,
    createdAt: event.createdAt,
    expiresAt: event.expiresAt,
    isExpired: event.isExpired,
    participantCount: event.responses.length,
  };
}

async function findEventOrThrow(shortId) {
  const event = await Event.findOne({ shortId });

  if (!event) {
    const error = new Error("Event not found.");
    error.status = 404;
    throw error;
  }

  return refreshExpirationStatus(event);
}

async function generateUniqueShortId() {
  let shortId = generateShortId();

  while (await Event.exists({ shortId })) {
    shortId = generateShortId();
  }

  return shortId;
}

export async function createEvent(req, res, next) {
  try {
    const validationError = validateCreateEventPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const now = new Date();
    const shortId = await generateUniqueShortId();
    const event = await Event.create({
      id: generateUuid(),
      shortId,
      title: sanitizeText(req.body.title),
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startTime: req.body.startTime || undefined,
      endTime: req.body.endTime || undefined,
      timezone: req.body.timezone || undefined,
      expectedParticipants: req.body.expectedParticipants ? Number(req.body.expectedParticipants) : undefined,
      createdAt: now,
      expiresAt: createExpiryDate(now),
    });

    return res.status(201).json({
      event: buildPublicEvent(event),
      shareUrl: `/e/${event.shortId}`,
      resultsUrl: `/e/${event.shortId}/results`,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEvent(req, res, next) {
  try {
    const event = await findEventOrThrow(req.params.shortId);

    return res.json({
      event: buildPublicEvent(event),
    });
  } catch (error) {
    return next(error);
  }
}

export async function submitAvailability(req, res, next) {
  try {
    const event = await findEventOrThrow(req.params.shortId);

    if (event.isExpired) {
      return res.status(410).json({
        message: "This event has expired.",
        event: buildPublicEvent(event),
      });
    }

    const validationError = validateResponsePayload(event, req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const normalizedName = sanitizeText(req.body.name).toLowerCase();
    const nextResponse = {
      name: sanitizeText(req.body.name),
      availability: req.body.availability,
      submittedAt: new Date(),
    };

    const existingIndex = event.responses.findIndex(
      (response) => response.name.toLowerCase() === normalizedName
    );

    if (existingIndex >= 0) {
      event.responses[existingIndex] = nextResponse;
    } else {
      event.responses.push(nextResponse);
    }

    await event.save();

    return res.status(201).json({
      message: "Availability saved.",
      event: buildPublicEvent(event),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getResults(req, res, next) {
  try {
    const event = await findEventOrThrow(req.params.shortId);

    return res.json({
      event: buildPublicEvent(event),
      results: calculateResults(event),
    });
  } catch (error) {
    return next(error);
  }
}

