"use client";

import { createTheme, PaletteOptions } from "@mui/material";
import { darkPalette } from "./dark";
import { lightPalette } from "./light";

// Refer to: https://www.radix-ui.com/themes/docs/theme/spacing
const spaces = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64];

// Resolves to --font-sans defined in verse.css. Keeping this as a var() ref
// means MUI and Tailwind always read from the same font stack.
const bodyFont = "var(--font-sans)";

declare module "@mui/material/styles" {
  interface Palette {
    dark: Palette["primary"];
  }

  interface PaletteOptions {
    dark?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    dark: true;
  }
}

const createBaseTheme = (palette: PaletteOptions) =>
  createTheme({
    //cssVariables: true, // !!! Important, otherwise MUI tokens does not work in Tailwind CSS classes.
    cssVariables: {
      nativeColor: true, // Using CSS color-mix.
    },
    palette,
    shape: {
      borderRadius: 8, // Default radius for all elements.
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
        fontFamily: bodyFont,
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
        fontFamily: bodyFont,
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
        fontFamily: bodyFont,
        fontSize: "28px",
        fontWeight: 600,
        lineHeight: "36px",
        letterSpacing: "-0.0075em",
      },
      h4: {
        // Radix size 6 → 24px
        fontFamily: bodyFont,
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
          disableElevation: true,
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
            paddingLeft: spaces[5],
            paddingRight: spaces[5],
            paddingTop: spaces[2],
            paddingBottom: spaces[2],
            margin: 0,
            borderRadius: 9999,
            boxShadow: "var(--mui-shadow-button)",
            transition:
              "background-color 150ms, box-shadow 150ms, transform 150ms",
            "&:hover": {
              boxShadow: "var(--mui-shadow-button-hover)",
            },
            "&:active": {
              transform: "translateY(1px)",
            },
            "&.Mui-disabled": {
              boxShadow: "none",
            },
            "@media (max-width:600px)": {
              fontSize: "1rem",
              lineHeight: "24px",
            },
          },
          sizeSmall: {
            borderRadius: 9999,
            paddingLeft: spaces[4],
            paddingRight: spaces[4],
            paddingTop: spaces[1],
            paddingBottom: spaces[1],
          },
          sizeLarge: {
            borderRadius: 12,
            paddingLeft: spaces[6],
            paddingRight: spaces[6],
            paddingTop: spaces[3],
            paddingBottom: spaces[3],
          },
          outlined: {
            borderColor: "var(--mui-palette-divider)",
            boxShadow: "none",
            "&:hover": {
              borderColor: "var(--mui-palette-text-secondary)",
              backgroundColor: "var(--mui-palette-action-hover)",
              boxShadow: "none",
            },
          },
          text: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "var(--mui-palette-action-hover)",
            },
          },
          startIcon: {
            marginRight: "2px",
          },
        },
        variants: [
          // MUI's contained variant pulls text color from palette[color].contrastText.
          // While MUI's outlined/text variants pull both text and border from
          // palette[color].main.
          //
          // `color="dark"` is meant for the *contained* fill (near-black surface
          // with light contrastText). For outlined/text variants the default
          // would paint text+border in `dark.main` (near-black) — invisible on
          // the dark background — so fall back to the scheme's text color.
          {
            props: { variant: "outlined", color: "dark" },
            style: {
              color: "var(--mui-palette-text-primary)",
              borderColor: "var(--mui-palette-divider)",
              "&:hover": {
                borderColor: "var(--mui-palette-text-secondary)",
                backgroundColor: "var(--mui-palette-action-hover)",
              },
            },
          },
          {
            props: { variant: "text", color: "dark" },
            style: {
              color: "var(--mui-palette-text-primary)",
              "&:hover": {
                backgroundColor: "var(--mui-palette-action-hover)",
              },
            },
          },
        ],
      },
      MuiIconButton: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            backgroundColor: "var(--mui-palette-background-paper)",
            boxShadow: "var(--mui-shadow-button)",
            transition: "background-color 150ms, box-shadow 150ms",
            "&:hover": {
              boxShadow: "var(--mui-shadow-button-hover)",
              backgroundColor: "var(--mui-palette-action-hover)",
            },
            "&.Mui-disabled": {
              boxShadow: "none",
            },
          },
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
          root: {
            borderRadius: 10,
            backgroundColor: "transparent",
            boxShadow: "none",
            transition: "box-shadow 150ms, border-color 150ms",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--mui-palette-divider)",
              transition: "border-color 150ms",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--mui-palette-text-secondary)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--mui-palette-primary-main)",
              borderWidth: "1px",
            },
            "&.Mui-disabled": {
              boxShadow: "none",
            },
          },
          input: {
            padding: "10px 14px",
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
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: "none",
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
            border: "1px solid var(--mui-palette-divider)",
            boxShadow: "var(--mui-shadow-surface-md)",
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
        styleOverrides: {
          root: {
            color: "var(--mui-palette-action-active)",
            "&.Mui-checked": {
              color: "var(--mui-palette-primary-main)",
            },
            "&.Mui-disabled": {
              color: "var(--mui-palette-action-disabled)",
            },
          },
        },
      },
      MuiRadio: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            color: "var(--mui-palette-action-active)",
            "&.Mui-checked": {
              color: "var(--mui-palette-primary-main)",
            },
            "&.Mui-disabled": {
              color: "var(--mui-palette-action-disabled)",
            },
          },
        },
      },
      MuiSwitch: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          switchBase: {
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "var(--mui-palette-primary-main)",
              opacity: 1,
            },
            "&.Mui-checked .MuiSwitch-thumb": {
              backgroundColor: "var(--mui-palette-primary-contrastText)",
            },
          },
          track: {
            backgroundColor: "var(--mui-palette-action-disabledBackground)",
            border: "1px solid var(--mui-palette-divider)",
            opacity: 1,
            boxShadow: "var(--mui-shadow-inset)",
          },
          thumb: {
            backgroundColor: "var(--mui-palette-text-primary)",
            boxShadow: "var(--mui-shadow-surface-sm)",
          },
        },
      },
      MuiSlider: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          rail: {
            backgroundColor: "var(--mui-palette-action-disabledBackground)",
            opacity: 1,
            boxShadow: "var(--mui-shadow-inset)",
          },
          track: {
            backgroundColor: "var(--mui-palette-primary-main)",
            border: "none",
          },
          thumb: {
            backgroundColor: "var(--mui-palette-background-paper)",
            border: "1px solid var(--mui-palette-divider)",
            boxShadow: "var(--mui-shadow-surface-sm)",
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "var(--mui-shadow-surface-md)",
            },
          },
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
          outlined: {
            borderColor: "var(--mui-palette-divider)",
          },
          filled: {
            border: "1px solid var(--mui-palette-divider)",
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
                border: "1px solid var(--mui-palette-divider)",
                boxShadow: "var(--mui-shadow-surface-md)",
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
          elevation: 0,
          sx: {
            borderRadius: 2, // 2 * shape.borderRadius = 16px
          },
        },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: "1px solid var(--mui-palette-divider)",
            boxShadow: "var(--mui-shadow-surface-sm)",
            transition:
              "background-color 200ms, box-shadow 200ms, border-color 200ms",
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
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: "var(--mui-palette-primary-main)",
            height: "2px",
            borderRadius: "1px",
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
            color: "var(--mui-palette-text-secondary)",
            "&.Mui-selected": {
              color: "var(--mui-palette-text-primary)",
            },
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
