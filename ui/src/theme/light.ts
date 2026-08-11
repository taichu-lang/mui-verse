import { PaletteOptions } from "@mui/material";

export const lightPalette: PaletteOptions = {
  mode: "light",

  // teal
  primary: {
    50: "oklch(0.98 0.02 185)",
    100: "oklch(0.94 0.05 185)",
    200: "oklch(0.90 0.09 185)",
    300: "oklch(0.85 0.13 185)",
    400: "oklch(0.78 0.15 185)",
    500: "oklch(0.70 0.14 185)",
    600: "oklch(0.60 0.12 185)",
    700: "oklch(0.50 0.10 188)",
    800: "oklch(0.43 0.08 188)",
    900: "oklch(0.38 0.06 188)",
    light: "oklch(0.85 0.13 185)",
    main: "oklch(0.70 0.14 185)",
    dark: "oklch(0.50 0.10 188)",
    contrastText: "oklch(1 0 0)",
  },

  // violet
  secondary: {
    50: "oklch(0.97 0.02 293)",
    100: "oklch(0.94 0.03 293)",
    200: "oklch(0.89 0.06 293)",
    300: "oklch(0.81 0.11 293)",
    400: "oklch(0.70 0.18 293)",
    500: "oklch(0.61 0.25 293)",
    600: "oklch(0.54 0.28 293)",
    700: "oklch(0.49 0.27 293)",
    800: "oklch(0.43 0.23 293)",
    900: "oklch(0.38 0.19 293)",
    light: "oklch(0.81 0.11 293)",
    main: "oklch(0.61 0.25 293)",
    dark: "oklch(0.49 0.27 293)",
    contrastText: "oklch(1 0 0)",
  },

  // muted teal-cyan
  info: {
    50: "oklch(0.98 0.012 220)",
    100: "oklch(0.96 0.020 220)",
    200: "oklch(0.92 0.030 220)",
    300: "oklch(0.85 0.045 220)",
    400: "oklch(0.78 0.060 220)",
    500: "oklch(0.58 0.050 220)",
    600: "oklch(0.51 0.048 220)",
    700: "oklch(0.44 0.045 220)",
    800: "oklch(0.37 0.040 220)",
    900: "oklch(0.30 0.035 220)",
    light: "oklch(0.85 0.045 220)",
    main: "oklch(0.58 0.050 220)",
    dark: "oklch(0.44 0.045 220)",
    contrastText: "oklch(1 0 0)",
  },

  success: {
    50: "oklch(0.98 0.012 150)",
    100: "oklch(0.96 0.025 150)",
    200: "oklch(0.92 0.045 150)",
    300: "oklch(0.86 0.075 150)",
    400: "oklch(0.80 0.100 150)",
    500: "oklch(0.70 0.100 150)",
    600: "oklch(0.62 0.090 150)",
    700: "oklch(0.52 0.080 150)",
    800: "oklch(0.42 0.070 150)",
    900: "oklch(0.32 0.060 150)",
    light: "oklch(0.86 0.075 150)",
    main: "oklch(0.70 0.100 150)",
    dark: "oklch(0.52 0.080 150)",
    contrastText: "oklch(1 0 0)",
  },

  // amber
  warning: {
    50: "oklch(0.99 0.02 95)",
    100: "oklch(0.98 0.05 95)",
    200: "oklch(0.96 0.08 95)",
    300: "oklch(0.92 0.12 92)",
    400: "oklch(0.88 0.15 88)",
    500: "oklch(0.84 0.17 86)",
    600: "oklch(0.77 0.16 80)",
    700: "oklch(0.72 0.15 76)",
    800: "oklch(0.65 0.14 72)",
    900: "oklch(0.55 0.13 68)",
    light: "oklch(0.92 0.12 92)",
    main: "oklch(0.84 0.17 86)",
    dark: "oklch(0.72 0.15 76)",
    contrastText: "oklch(0.30 0.05 70)",
  },

  // rose
  error: {
    50: "oklch(0.98 0.012 15)",
    100: "oklch(0.95 0.025 15)",
    200: "oklch(0.90 0.045 15)",
    300: "oklch(0.80 0.080 15)",
    400: "oklch(0.72 0.130 15)",
    500: "oklch(0.64 0.170 15)",
    600: "oklch(0.55 0.160 13)",
    700: "oklch(0.46 0.140 12)",
    800: "oklch(0.38 0.120 12)",
    900: "oklch(0.32 0.100 12)",
    light: "oklch(0.80 0.080 15)",
    main: "oklch(0.64 0.170 15)",
    dark: "oklch(0.46 0.140 12)",
    contrastText: "oklch(1 0 0)",
  },

  // Apple System Gray scale
  grey: {
    50: "oklch(0.98 0 0)",
    100: "oklch(0.96 0.003 280)",
    200: "oklch(0.92 0.003 280)",
    300: "oklch(0.86 0.004 280)",
    400: "oklch(0.82 0.004 280)",
    500: "oklch(0.74 0.004 280)",
    600: "oklch(0.62 0.005 280)",
    700: "oklch(0.46 0.005 280)",
    800: "oklch(0.36 0.004 280)",
    900: "oklch(0.30 0.004 280)",
    A100: "oklch(0.96 0.003 280)",
    A200: "oklch(0.92 0.003 280)",
    A400: "oklch(0.74 0.004 280)",
    A700: "oklch(0.46 0.005 280)",
  },

  // Near-black surface for the `color="dark"` button variant — mirrors dark.ts
  // so the dark-on-light contained button reads consistently across schemes.
  dark: {
    main: "oklch(0.20 0.008 260)",
    light: "oklch(0.28 0.008 260)",
    dark: "oklch(0.16 0.005 260)",
    contrastText: "oklch(0.96 0.005 260)",
  },

  text: {
    primary: "oklch(0 0 0)",
    secondary: "oklch(0.30 0.004 280 / 0.60)",
    disabled: "oklch(0.30 0.004 280 / 0.30)",
  },

  background: {
    default: "oklch(97.73% 0.002 165.08)",
    paper: "oklch(1 0 0)",
  },

  divider: "oklch(0.30 0.004 280 / 0.29)",
};
