const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_BASE_URL = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

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
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export function createEvent(payload) {
  return request("/event", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchEvent(shortId) {
  return request(`/event/${shortId}`);
}

export function submitAvailability(shortId, payload) {
  return request(`/event/${shortId}/respond`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchResults(shortId) {
  return request(`/event/${shortId}/results`);
}

