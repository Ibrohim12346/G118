import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      await authService.fetchCsrf();
      const data = await authService.getMeRequest();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async ({ email, password, remember }) => {
    const data = await authService.loginRequest({ email, password, remember });
    setUser(data.user || null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const data = await authService.refreshRequest();
    return data;
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      refreshToken,
      updateUser,
      checkSession,
    }),
    [user, loading, login, logout, refreshToken, updateUser, checkSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
}