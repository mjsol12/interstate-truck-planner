import { createTheme, type Theme } from "@mui/material/styles";
import { tokens, type ColorMode } from "./tokens";

export function createAppTheme(mode: ColorMode): Theme {
  const isDark = mode === "dark";
  const c = tokens.colors;
  const d = tokens.dark;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: c.brand[500],
        dark: c.brand[600],
        light: c.primaryLight,
        contrastText: "#ffffff",
      },
      text: {
        primary: isDark ? d.text : c.text,
        secondary: isDark ? d.textSecondary : c.textSecondary,
      },
      background: {
        default: isDark ? d.background : c.background,
        paper: isDark ? d.surface : c.surface,
      },
      divider: isDark ? d.border : c.border,
      success: { main: c.success },
      warning: { main: c.warning },
      error: { main: c.error },
    },
    typography: {
      fontFamily: tokens.typography.fontFamily,
      h1: {
        fontSize: "2rem",
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontSize: "1.5rem",
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
      },
      h3: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
      h4: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
      h5: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
      h6: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.5 },
      body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
      body2: { fontSize: "0.8125rem", lineHeight: 1.6 },
      overline: {
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        lineHeight: 1.5,
      },
    },
    shape: { borderRadius: tokens.radius.md },
    spacing: tokens.spacing.unit,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark
              ? "#344054 transparent"
              : "#d0d5dd transparent",
          },
          ":focus-visible": {
            outline: `2px solid ${c.focusRing}`,
            outlineOffset: 2,
          },
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": {
              animationDuration: "0.01ms !important",
              transitionDuration: "0.01ms !important",
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: tokens.radius.sm,
            minHeight: 40,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: tokens.shadow.sm,
            border: `1px solid ${isDark ? d.border : c.border}`,
            borderRadius: tokens.radius.md,
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.sm,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "0.75rem",
            borderRadius: tokens.radius.sm,
          },
        },
      },
    },
  });
}
