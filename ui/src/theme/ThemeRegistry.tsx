"use client";

import { useThemeMode } from "@mui-verse/ui/hooks/useThemeMode";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import { darkTheme, lightTheme } from "./theme";

interface ThemeRegistryProps {
  children: ReactNode;
}

function ThemedContent({ children }: ThemeRegistryProps) {
  const { isDark } = useThemeMode();
  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

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
