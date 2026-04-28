import { compareDateStrings, isValidDateString, listDateRange } from "./dateRange.js";
import { sanitizeText } from "./sanitize.js";

const MAX_RANGE_DAYS = 90;

export function validateCreateEventPayload(payload) {
  const title = sanitizeText(payload.title);
  const startDate = payload.startDate;
  const endDate = payload.endDate;
  const startTime = payload.startTime;
  const endTime = payload.endTime;
  const timezone = payload.timezone;
  const expectedParticipants = payload.expectedParticipants;

  if (!title) {
    return "Event title is required.";
  }

  if (title.length > 120) {
    return "Event title must be 120 characters or fewer.";
  }

  if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
    return "Start date and end date must be valid YYYY-MM-DD values.";
  }

  if (compareDateStrings(startDate, endDate) > 0) {
    return "End date must be on or after start date.";
  }

  if (listDateRange(startDate, endDate).length > MAX_RANGE_DAYS) {
    return `Date range must be ${MAX_RANGE_DAYS} days or fewer.`;
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (startTime && !timeRegex.test(startTime)) {
    return "Start time must be a valid HH:mm string.";
  }
  if (endTime && !timeRegex.test(endTime)) {
    return "End time must be a valid HH:mm string.";
  }

  if (timezone && timezone.length > 50) {
    return "Timezone must be 50 characters or fewer.";
  }

  if (expectedParticipants !== undefined) {
    const num = Number(expectedParticipants);
    if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
      return "Expected participants must be a positive integer.";
    }
  }

  return null;
}

export function validateResponsePayload(event, payload) {
  const name = sanitizeText(payload.name);

  if (!name) {
    return "Participant name is required.";
  }

  if (name.length > 80) {
    return "Participant name must be 80 characters or fewer.";
  }

  if (
    !payload.availability ||
    typeof payload.availability !== "object" ||
    Array.isArray(payload.availability)
  ) {
    return "Availability is required.";
  }

  const validDates = new Set(listDateRange(event.startDate, event.endDate));

  for (const [date, choice] of Object.entries(payload.availability)) {
    if (!validDates.has(date)) {
      return `Date ${date} is outside the event range.`;
    }

    if (!["yes", "maybe", "no"].includes(choice)) {
      return `Availability for ${date} must be yes, maybe, or no.`;
    }
  }

  return null;
}
