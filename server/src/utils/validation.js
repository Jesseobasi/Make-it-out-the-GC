import {
  compareDateStrings,
  isValidDateString,
  listDateRange,
} from "./dates.js";

export function validateEventPayload(payload) {
  const title = payload.title?.trim();
  const startDate = payload.startDate;
  const endDate = payload.endDate;

  if (!title) {
    return "Event title is required.";
  }

  if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
    return "Start and end dates must be valid YYYY-MM-DD strings.";
  }

  if (compareDateStrings(startDate, endDate) > 0) {
    return "End date must be on or after start date.";
  }

  return null;
}

export function validateResponsePayload(event, payload) {
  const name = payload.name?.trim();
  const availability = payload.availability;

  if (!name) {
    return "Participant name is required.";
  }

  if (!availability || typeof availability !== "object") {
    return "Availability is required.";
  }

  const validDates = new Set(listDateRange(event.startDate, event.endDate));

  for (const [date, choice] of Object.entries(availability)) {
    if (!validDates.has(date)) {
      return `Date ${date} is outside the event range.`;
    }

    if (!["yes", "maybe", "no"].includes(choice)) {
      return `Availability for ${date} must be yes, maybe, or no.`;
    }
  }

  return null;
}

