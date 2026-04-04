import { PaletteOptions } from "@mui/material";

export const lightPalette: PaletteOptions = {
  mode: "light",
  // teal
  primary: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
    light: "#5EEAD4", // 300
    main: "#14B8A6", // 500 (Radix Teal 6)
    dark: "#0F766E", // 700
    contrastText: "#FFFFFF",
  },

  // violet
  secondary: {
    50: "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6",
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
    light: "#C4B5FD",
    main: "#8B5CF6",
    dark: "#6D28D9",
    contrastText: "#FFFFFF",
  },

  info: {
    50: "#F5FBFC",
    100: "#E8F6F8",
    200: "#D0EEF2",
    300: "#A8E0E8",
    400: "#7ACDD8",
    500: "#4A8B9C",
    600: "#3A7B8C",
    700: "#2A6B7C",
    800: "#1A5B6C",
    900: "#0A4B5C",
    light: "#A8E0E8",
    main: "#4A8B9C",
    dark: "#2A6B7C",
    contrastText: "#FFFFFF",
  },

  success: {
    50: "#F8FCF9",
    100: "#E6F7EB",
    200: "#CCEFD8",
    300: "#A8E2BF",
    400: "#85D5A6",
    500: "#5CB88C",
    600: "#4C9A74",
    700: "#3C7C5C",
    800: "#2C5E44",
    900: "#1C402C",
    light: "#A8E2BF", // 300
    main: "#5CB88C", // 500
    dark: "#3C7C5C", // 700
    contrastText: "#FFFFFF",
  },

  warning: {
    50: "#FFFDF7",
    100: "#FEF9E6",
    200: "#FDF5D5",
    300: "#FCE9A0", // light
    400: "#FBD56A",
    500: "#FBBF24", // main
    600: "#F9A825",
    700: "#EAB308", // dark
    800: "#CA8A04",
    900: "#B45309",
    light: "#FCE9A0",
    main: "#FBBF24",
    dark: "#EAB308",
    contrastText: "#57441C",
  },

  error: {
    50: "#FEF2F7",
    100: "#FCE7ED",
    200: "#FACDD6",
    300: "#F6A8B8", // light
    400: "#F07D95",
    500: "#E0526C", // main
    600: "#C53F5D", // Radix Ruby 7
    700: "#A12C45", // dark
    800: "#881337", // Radix Pink 9
    900: "#701A2D",
    light: "#F6A8B8",
    main: "#E0526C",
    dark: "#A12C45",
    contrastText: "#FFFFFF",
  },

  // Apple System Gray scale
  grey: {
    50: "#F9F9F9",
    100: "#F2F2F7",
    200: "#E5E5EA",
    300: "#D1D1D6",
    400: "#C7C7CC",
    500: "#AEAEB2",
    600: "#8E8E93",
    700: "#636366",
    800: "#48484A",
    900: "#3A3A3C",
    A100: "#F2F2F7",
    A200: "#E5E5EA",
    A400: "#AEAEB2",
    A700: "#636366",
  },

  text: {
    primary: "#000000",
    secondary: "#3C3C4399", // 60% opacity
    disabled: "#3C3C434D", // 30% opacity
  },

  background: {
    default: "#F2F2F7", // Apple grouped background
    paper: "#FFFFFF",
  },

  divider: "#3C3C434A", // ~29% opacity
};
