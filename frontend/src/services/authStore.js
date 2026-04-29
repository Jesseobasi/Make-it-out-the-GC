const TOKEN_KEY = "bds_auth_token";

export function getAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(TOKEN_KEY) || "";
}

export function setAuthToken(token) {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
}
