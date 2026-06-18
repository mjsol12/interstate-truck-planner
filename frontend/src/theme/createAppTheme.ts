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
        light: isDark ? d.primaryLight : c.primaryLight,
        contrastText: "#ffffff",
      },
      text: {
        primary: isDark ? d.text : c.text,
        secondary: isDark ? d.textSecondary : c.textSecondary,
      },
      background: {
        default: isDark ? d.background : c.background,
        paper: isDark ? d.surface : c.surface,
        elevated: isDark ? d.elevated : c.backgroundSubtle,
      },
      divider: isDark ? d.border : c.border,
      action: {
        hover: isDark ? d.hover : "rgba(16, 24, 40, 0.04)",
        selected: isDark ? d.selected : "rgba(70, 95, 255, 0.08)",
        disabled: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(16, 24, 40, 0.38)",
        disabledBackground: isDark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(16, 24, 40, 0.12)",
      },
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
              ? "#475467 transparent"
              : "#d0d5dd transparent",
          },
          ":focus-visible": {
            outline: `2px solid ${isDark ? tokens.colors.sidebarNav.focusRing : c.focusRing}`,
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
          outlined: {
            borderColor: isDark ? d.borderStrong : c.border,
            "&:hover": {
              borderColor: isDark ? d.textMuted : c.borderStrong,
              backgroundColor: isDark ? d.hover : "rgba(16, 24, 40, 0.04)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDark ? d.shadow : tokens.shadow.sm,
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
      MuiChip: {
        styleOverrides: {
          outlined: {
            borderColor: isDark ? d.borderStrong : c.border,
          },
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
            backgroundColor: isDark ? d.elevated : c.gray[900],
            color: d.text,
            border: isDark ? `1px solid ${d.borderStrong}` : "none",
          },
        },
      },
    },
  });
}
