const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

export function createExpiryDate(createdAt = new Date()) {
  return new Date(createdAt.getTime() + SEVEN_DAYS_IN_MS);
}

export function hasExpired(event, now = new Date()) {
  if (!event?.expiresAt) {
    return false;
  }

  return now.getTime() > new Date(event.expiresAt).getTime();
}

export async function refreshExpirationStatus(event) {
  if (!event) {
    return event;
  }

  if (!event.isExpired && hasExpired(event)) {
    event.isExpired = true;
    await event.save();
  }

  return event;
}

