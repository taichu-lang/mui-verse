import { PaletteOptions } from "@mui/material";

export const darkPalette: PaletteOptions = {
  mode: "dark",

  // gold (chromatic warm metal)
  primary: {
    50: "oklch(0.20 0.04 85)",
    100: "oklch(0.28 0.06 85)",
    200: "oklch(0.38 0.08 85)",
    300: "oklch(0.50 0.10 85)",
    400: "oklch(0.62 0.12 85)",
    500: "oklch(0.72 0.13 90)",
    600: "oklch(0.78 0.14 90)",
    700: "oklch(0.84 0.13 92)",
    800: "oklch(0.90 0.11 94)",
    900: "oklch(0.95 0.06 95)",
    light: "oklch(0.86 0.13 90)",
    main: "oklch(0.78 0.14 90)",
    dark: "oklch(0.62 0.12 80)",
    contrastText: "oklch(0.13 0.005 260)",
  },

  // amethyst — cool violet that pairs with gold (classic "gold + violet"
  // metalwork palette). Distinct from info's blue so the two never read as
  // the same family.
  secondary: {
    50: "oklch(0.20 0.05 285)",
    100: "oklch(0.28 0.07 285)",
    200: "oklch(0.36 0.09 285)",
    300: "oklch(0.46 0.11 285)",
    400: "oklch(0.55 0.13 285)",
    500: "oklch(0.62 0.13 280)",
    600: "oklch(0.70 0.12 280)",
    700: "oklch(0.78 0.10 280)",
    800: "oklch(0.86 0.07 280)",
    900: "oklch(0.94 0.04 280)",
    light: "oklch(0.72 0.13 280)",
    main: "oklch(0.62 0.13 280)",
    dark: "oklch(0.46 0.11 285)",
    contrastText: "oklch(0.97 0.005 260)",
  },

  info: {
    50: "oklch(0.20 0.04 230)",
    100: "oklch(0.28 0.06 230)",
    200: "oklch(0.36 0.08 230)",
    300: "oklch(0.46 0.10 230)",
    400: "oklch(0.58 0.12 230)",
    500: "oklch(0.68 0.14 230)",
    600: "oklch(0.76 0.12 230)",
    700: "oklch(0.84 0.09 230)",
    800: "oklch(0.90 0.06 230)",
    900: "oklch(0.96 0.03 230)",
    light: "oklch(0.76 0.12 230)",
    main: "oklch(0.68 0.14 230)",
    dark: "oklch(0.46 0.10 230)",
    contrastText: "oklch(0.13 0.005 260)",
  },

  success: {
    50: "oklch(0.20 0.05 150)",
    100: "oklch(0.28 0.07 150)",
    200: "oklch(0.36 0.09 150)",
    300: "oklch(0.46 0.12 150)",
    400: "oklch(0.58 0.14 150)",
    500: "oklch(0.68 0.16 150)",
    600: "oklch(0.76 0.13 150)",
    700: "oklch(0.84 0.10 150)",
    800: "oklch(0.90 0.06 150)",
    900: "oklch(0.96 0.03 150)",
    light: "oklch(0.76 0.13 150)",
    main: "oklch(0.68 0.16 150)",
    dark: "oklch(0.46 0.12 150)",
    contrastText: "oklch(0.13 0.005 260)",
  },

  // copper/bronze — warm metal at hue ~50, distinctly red-orange so it
  // doesn't blur into primary gold (hue 90).
  warning: {
    50: "oklch(0.22 0.07 45)",
    100: "oklch(0.30 0.10 45)",
    200: "oklch(0.40 0.13 45)",
    300: "oklch(0.52 0.16 48)",
    400: "oklch(0.62 0.18 50)",
    500: "oklch(0.70 0.18 50)",
    600: "oklch(0.78 0.15 55)",
    700: "oklch(0.85 0.11 60)",
    800: "oklch(0.91 0.07 65)",
    900: "oklch(0.96 0.04 70)",
    light: "oklch(0.78 0.15 55)",
    main: "oklch(0.70 0.18 50)",
    dark: "oklch(0.52 0.16 48)",
    contrastText: "oklch(0.13 0.005 260)",
  },

  // destructive — mirrors metal-fx `--destructive` oklch(0.65 0.22 25)
  error: {
    50: "oklch(0.22 0.08 25)",
    100: "oklch(0.30 0.12 25)",
    200: "oklch(0.40 0.16 25)",
    300: "oklch(0.50 0.20 25)",
    400: "oklch(0.58 0.22 25)",
    500: "oklch(0.65 0.22 25)",
    600: "oklch(0.74 0.18 25)",
    700: "oklch(0.82 0.13 25)",
    800: "oklch(0.90 0.08 25)",
    900: "oklch(0.96 0.04 25)",
    light: "oklch(0.74 0.18 25)",
    main: "oklch(0.65 0.22 25)",
    dark: "oklch(0.50 0.20 25)",
    contrastText: "oklch(0.97 0.005 260)",
  },

  // cool steel grayscale — mirrors the muted/accent/border axis in metal-fx
  grey: {
    50: "oklch(0.17 0.008 260)",
    100: "oklch(0.20 0.008 260)",
    200: "oklch(0.24 0.008 260)",
    300: "oklch(0.28 0.008 260)",
    400: "oklch(0.36 0.008 260)",
    500: "oklch(0.48 0.008 260)",
    600: "oklch(0.62 0.010 260)",
    700: "oklch(0.72 0.010 260)",
    800: "oklch(0.84 0.008 260)",
    900: "oklch(0.94 0.005 260)",
    A100: "oklch(0.20 0.008 260)",
    A200: "oklch(0.28 0.008 260)",
    A400: "oklch(0.48 0.008 260)",
    A700: "oklch(0.72 0.010 260)",
  },

  dark: {
    main: "oklch(0.20 0.008 260)",
    light: "oklch(0.28 0.008 260)",
    dark: "oklch(0.26 0.005 260)",
    contrastText: "oklch(0.96 0.005 260)",
  },

  text: {
    primary: "oklch(0.96 0.005 260)",
    secondary: "oklch(0.96 0.005 260 / 0.62)",
    disabled: "oklch(0.96 0.005 260 / 0.38)",
  },

  background: {
    default: "oklch(0.13 0.005 260)",
    paper: "oklch(0.17 0.008 260)",
  },

  action: {
    hover: "oklch(0.26 0.005 260)", // Same as dark.dark.
  },

  divider: "oklch(1 0 0 / 0.10)",
};
