const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  ""
);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function createEvent(payload) {
  return request("/event", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchEvent(eventId) {
  return request(`/event/${eventId}`);
}

export function submitAvailability(eventId, payload) {
  return request(`/event/${eventId}/respond`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchResults(eventId) {
  return request(`/event/${eventId}/results`);
}

