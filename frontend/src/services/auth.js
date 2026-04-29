import { request } from "./api.js";
import { setAuthToken } from "./authStore.js";

export async function loginWithEmail(email) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  setAuthToken(data.token);
  return data;
}

export function fetchCurrentUser() {
  return request("/auth/me");
}

export function fetchMyEvents() {
  return request("/auth/my-events");
}
