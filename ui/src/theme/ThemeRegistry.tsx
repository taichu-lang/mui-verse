"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import { darkTheme, lightTheme } from "./theme";
import { useTheme } from "./useTheme";

interface ThemeRegistryProps {
  children: ReactNode;
}

function ThemedContent({ children }: ThemeRegistryProps) {
  const { isDark } = useTheme();
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
