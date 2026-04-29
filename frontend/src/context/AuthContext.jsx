import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchCurrentUser, loginWithEmail } from "../services/auth.js";
import { getAuthToken, setAuthToken } from "../services/authStore.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getAuthToken()));
  const [authAvailable, setAuthAvailable] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .then((data) => {
        setAuthAvailable(true);
        setUser(data.user);
      })
      .catch((error) => {
        if (error?.status === 404) {
          setAuthAvailable(false);
        }
        setAuthToken("");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email) {
    const data = await loginWithEmail(email);
    setAuthAvailable(true);
    setUser(data.user);
    return data.user;
  }

  function signOut() {
    setAuthToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      authAvailable,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
    }),
    [user, loading, authAvailable]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
