import { request } from "./api.js";
import { setAuthToken } from "./authStore.js";

function withAuthRouteFallback(error) {
  if (error?.status === 404) {
    const nextError = new Error(
      "Login is not available on this backend yet. Deploy the backend with /api/auth routes."
    );
    nextError.status = error.status;
    throw nextError;
  }

  throw error;
}

export async function loginWithEmail(email) {
  try {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setAuthToken(data.token);
    return data;
  } catch (error) {
    return withAuthRouteFallback(error);
  }
}

export function fetchCurrentUser() {
  return request("/auth/me").catch(withAuthRouteFallback);
}

export function fetchMyEvents() {
  return request("/auth/my-events").catch(withAuthRouteFallback);
}
