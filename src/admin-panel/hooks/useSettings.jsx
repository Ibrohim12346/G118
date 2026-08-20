import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import * as settingsService from "../services/settingsService";
import { useTheme } from "./useTheme";
import useAsync from "./useAsync";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { setThemeMode } = useTheme();
  const { data, loading, reload } = useAsync(settingsService.getSettings);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (data) {
      setSettings(data);
      if (data.theme) setThemeMode(data.theme);
    }
  }, [data, setThemeMode]);

  const update = useCallback(
    async (patch) => {
      const next = await settingsService.updateSettings(patch);
      setSettings(next);
      if (patch.theme) setThemeMode(patch.theme);
      return next;
    },
    [setThemeMode]
  );

  const updateNotifications = useCallback(async (patch) => {
    const next = await settingsService.updateNotifications(patch);
    setSettings((s) => (s ? { ...s, notifications: next } : s));
  }, []);

  const updateSecurity = useCallback(async (patch) => {
    const next = await settingsService.updateSecurity(patch);
    setSettings((s) => (s ? { ...s, security: next } : s));
  }, []);

  const value = useMemo(
    () => ({ settings, loading, reload, update, updateNotifications, updateSecurity }),
    [settings, loading, reload, update, updateNotifications, updateSecurity]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings faqat SettingsProvider ichida ishlatiladi");
  return ctx;
}

export default useSettings;