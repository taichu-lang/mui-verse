"use client";

import { useThemeStore } from "@mui-verse/ui/hooks/useThemeStore";

export function useThemeMode() {
  const { mode, toggleTheme, setTheme } = useThemeStore();

  const isDark = mode === "dark";

  return {
    mode,
    isDark,
    toggleTheme,
    setTheme,
  };
}
