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
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = authService.getSession();
    if (s) setSession(s);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const s = await authService.login(email, password);
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const refresh = useCallback(async () => {
    const s = await authService.refreshSessionUser();
    if (s) setSession(s);
  }, []);

  const value = useMemo(
    () => ({ session, user: session?.user || null, loading, login, logout, refresh }),
    [session, loading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth faqat AuthProvider ichida ishlatiladi");
  return ctx;
}

export default useAuth;