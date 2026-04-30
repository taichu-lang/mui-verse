"use client";

import { createTheme, PaletteOptions } from "@mui/material";
import { darkPalette } from "./dark";
import { lightPalette } from "./light";

// Refer to: https://www.radix-ui.com/themes/docs/theme/spacing
const spaces = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64];

// Font stacks — CSS variables are set by next/font/local (fonts.ts) on <html>
const displayFont = [
  "var(--font-dm-sans)",
  "var(--font-manrope)",
  "var(--font-alibaba-puhuiti)",
  "sans-serif",
].join(",");

const bodyFont = [
  "var(--font-manrope)",
  "var(--font-noto-sans-sc)",
  '"PingFang SC"',
  '"Microsoft YaHei"',
  "sans-serif",
].join(",");

const createBaseTheme = (palette: PaletteOptions) =>
  createTheme({
    cssVariables: true, // !!! Important, otherwise MUI tokens does not work in Tailwind CSS classes.
    palette,
    shape: {
      borderRadius: 6, // Default radius for all elements.
    },
    typography: {
      fontFamily: bodyFont,

      fontSize: 16,
      htmlFontSize: 16,

      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,

      h1: {
        // Radix size 9 → 60px
        fontFamily: displayFont,
        fontSize: "60px",
        fontWeight: 700,
        lineHeight: "72px",
        letterSpacing: "-0.025em",
        "@media (max-width:600px)": {
          fontSize: "2.5rem", // 40px
        },
      },
      h2: {
        // Radix size 8 → 35px
        fontFamily: displayFont,
        fontSize: "35px",
        fontWeight: 700,
        lineHeight: "40px",
        letterSpacing: "-0.01em",
        "@media (max-width:600px)": {
          fontSize: "2rem", // 32px
        },
      },
      h3: {
        // Radix size 7 → 28px
        fontFamily: displayFont,
        fontSize: "28px",
        fontWeight: 600,
        lineHeight: "36px",
        letterSpacing: "-0.0075em",
      },
      h4: {
        // Radix size 6 → 24px
        fontFamily: displayFont,
        fontSize: "24px",
        fontWeight: 600,
        lineHeight: "30px",
        letterSpacing: "-0.00625em",
      },
      h5: {
        // Radix size 5 → 20px
        fontSize: "20px",
        fontWeight: 500,
        lineHeight: "28px",
        letterSpacing: "-0.005em",
      },
      h6: {
        // Radix size 4 → 18px
        fontSize: "18px",
        fontWeight: 500,
        lineHeight: "26px",
        letterSpacing: "-0.0025em",
      },

      subtitle1: {
        fontSize: "16px",
        fontWeight: 500,
        lineHeight: "24px",
        letterSpacing: "0em",
      },
      subtitle2: {
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "20px",
        letterSpacing: "0em",
      },
      body1: {
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        letterSpacing: "0em",
      },
      body2: {
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px",
        letterSpacing: "0.0025em",
      },

      button: {
        textTransform: "none",
        fontWeight: 500,
        fontSize: "15px",
        letterSpacing: "0.015em",
        "@media (max-width:600px)": {
          fontSize: "1rem",
        },
      },
      caption: {
        // Radix size 1 (12px)
        fontSize: "12px",
        lineHeight: "18px",
        letterSpacing: "0.0025em",
        fontStyle: "italic",
        fontWeight: 400,
      },
      overline: {
        fontSize: "11px",
        fontWeight: 600,
        lineHeight: "14px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      },
    },
    components: {
      MuiAlert: {
        styleOverrides: {
          message: {
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            padding: "8px 0",
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            fontWeight: 500,
            lineHeight: 1.4,
            color: palette.text?.secondary,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          size: "medium",
          variant: "contained",
        },
        styleOverrides: {
          root: {
            textTransform: "none", // Do not transform text to uppercase
            fontSize: "15px",
            fontWeight: 500,
            letterSpacing: "0.015em",
            lineHeight: "20px",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: spaces[4],
            paddingRight: spaces[4],
            paddingTop: spaces[2],
            paddingBottom: spaces[2],
            margin: 0,
            "@media (max-width:600px)": {
              fontSize: "1rem",
              lineHeight: "24px",
            },
          },
          startIcon: {
            marginRight: "2px",
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          sizeSmall: {
            padding: "6.25px",
          },
        },
      },
      MuiButtonGroup: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
          margin: "dense",
        },
      },
      MuiInputLabel: {
        defaultProps: {
          margin: "dense",
        },
        styleOverrides: {
          root: {
            fontSize: "14px",
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: "20px",
          },
        },
      },
      MuiInputBase: {
        defaultProps: {
          margin: "dense",
        },
        styleOverrides: {
          root: {
            fontSize: "14px",
            letterSpacing: 0,
            lineHeight: "20px",
          },
        },
      },
      MuiOutlinedInput: {
        // Default variant of TextField.
        styleOverrides: {
          input: {
            padding: "12px 14px",
          },
        },
      },
      MuiFormHelperText: {
        defaultProps: {
          margin: "dense",
        },
        styleOverrides: {
          root: {
            fontSize: "12px",
            lineHeight: "18px",
            letterSpacing: "0.005em",
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          maxWidth: "xs",
        },
        styleOverrides: {
          paper: {
            borderRadius: spaces[3],
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            paddingX: spaces[5],
            fontSize: "1.375rem", // 22px (h5)
            fontWeight: 500,
            lineHeight: "1.3",
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            marginRight: spaces[3],
            marginBottom: spaces[2],
          },
        },
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            fontSize: "1rem", // 16px (body1)
            lineHeight: "1.6",
            letterSpacing: 0,
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          dot: {
            height: "6px",
            minWidth: "6px",
            top: "4px",
            right: "4px",
          },
          standard: {
            height: "16px",
            minWidth: "16px",
            padding: 0,
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          size: "small",
        },
      },
      MuiPagination: {
        defaultProps: {
          size: "small",
        },
      },
      MuiChip: {
        defaultProps: {
          size: "small",
          sx: {
            px: 0.5,
            margin: 0,
          },
        },
        styleOverrides: {
          root: {
            fontSize: "14px",
            letterSpacing: "0.0025em",
            lineHeight: "20px",
          },
        },
      },
      MuiMenu: {
        defaultProps: {
          slotProps: {
            paper: {
              sx: {
                borderRadius: 2,
                margin: 0,
                paddingX: 2,
              },
            },
          },
        },
      },
      MuiMenuItem: {
        defaultProps: {
          dense: true,
          sx: {
            fontSize: "1rem", // 16px (body1)
            letterSpacing: 0,
            lineHeight: "1.6",
            margin: 0,
            padding: 2,
            borderRadius: 2,
            height: spaces[6],
          },
        },
      },
      MuiSvgIcon: {
        defaultProps: {
          fontSize: "small",
        },
        styleOverrides: {
          root: {
            width: 15,
            height: "auto",
            aspectRatio: 1, // width === height
          },
        },
      },
      MuiFab: {
        defaultProps: {
          size: "small",
        },
      },
      MuiFormControl: {
        defaultProps: {
          size: "small",
          margin: "dense",
        },
      },
      MuiRadio: {
        defaultProps: {
          size: "small",
        },
      },
      MuiSwitch: {
        defaultProps: {
          size: "small",
        },
      },
      MuiList: {
        defaultProps: {
          dense: true,
        },
      },
      MuiTable: {
        defaultProps: {
          size: "small",
        },
      },
      MuiCard: {
        defaultProps: {
          sx: {
            borderRadius: 2,
          },
        },
      },
      MuiCardHeader: {
        defaultProps: {
          slotProps: {
            title: {
              variant: "subtitle1",
            },
            subheader: {
              variant: "subtitle2",
            },
          },
          sx: {
            margin: 0,
          },
        },
        styleOverrides: {
          action: {
            alignSelf: "center",
          },
        },
      },
      MuiCardContent: {
        defaultProps: {
          sx: {
            py: 0,
            px: 2,
            margin: 0,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            textAlign: "center",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: "auto", // Needed.
            minWidth: "auto",
            textTransform: "none",
            fontSize: "0.875rem", // 14px (body2)
            fontWeight: 400,
            letterSpacing: "0.0025em",
            lineHeight: "1.55",
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          size: "small",
        },
      },
    },
  });

export const darkTheme = createBaseTheme(darkPalette);
export const lightTheme = createBaseTheme(lightPalette);
