"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ReactNode, useEffect, useMemo } from "react";
import { darkTheme, lightTheme } from "./theme";
import { useTheme } from "./useTheme";

interface ThemeRegistryProps {
  children: ReactNode;
}

function ThemedContent({ children }: ThemeRegistryProps) {
  const { isDark } = useTheme();
  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  // Mirror the active scheme onto <html> so scheme-scoped CSS in verse.css
  // (`[data-mui-color-scheme="dark"]`) can target the right state. MUI only
  // sets this attribute automatically when using the colorSchemes API; with
  // two single-scheme themes we wire it up ourselves.
  useEffect(() => {
    document.documentElement.dataset.muiColorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  return <ThemedContent>{children}</ThemedContent>;
}
