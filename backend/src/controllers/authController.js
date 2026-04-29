import { Event } from "../models/Event.js";
import { createAuthToken } from "../utils/authToken.js";
import { env } from "../config/env.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function toDashboardEvent(event) {
  return {
    id: event.id,
    shortId: event.shortId,
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    isExpired: event.isExpired,
    participantCount: event.responses.length,
    createdAt: event.createdAt,
  };
}

export function loginWithEmail(req, res) {
  const email = normalizeEmail(req.body?.email);

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  const token = createAuthToken(email, env.authSecret);

  return res.status(201).json({
    token,
    user: { email },
  });
}

export function getCurrentUser(req, res) {
  return res.json({
    user: { email: req.user.email },
  });
}

export async function getMyEvents(req, res, next) {
  try {
    const email = req.user.email;
    const [createdEvents, participatingEvents] = await Promise.all([
      Event.find({ ownerEmail: email }).sort({ createdAt: -1 }).lean(),
      Event.find({ "responses.participantEmail": email }).sort({ createdAt: -1 }).lean(),
    ]);

    const dedupedParticipating = participatingEvents.filter(
      (event) => event.ownerEmail !== email
    );

    return res.json({
      createdEvents: createdEvents.map(toDashboardEvent),
      participatingEvents: dedupedParticipating.map(toDashboardEvent),
    });
  } catch (error) {
    return next(error);
  }
}
