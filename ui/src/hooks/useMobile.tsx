"use client";

import { useMediaQuery, useTheme } from "@mui/material";

export function useMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return isMobile;
}
