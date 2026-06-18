import type { ElementType, ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import type { SvgIconProps } from "@mui/material/SvgIcon";

interface InsightTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ElementType<SvgIconProps>;
  iconColor?: "primary" | "success" | "warning";
}

const iconBg = {
  primary: "primary.light",
  success: "rgba(18, 183, 106, 0.12)",
  warning: "rgba(247, 144, 9, 0.12)",
} as const;

const iconFg = {
  primary: "primary.main",
  success: "success.main",
  warning: "warning.main",
} as const;

export default function InsightTile({
  label,
  value,
  hint,
  icon: Icon,
  iconColor = "primary",
}: InsightTileProps) {
  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        borderRadius: 1,
        bgcolor: "background.default",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box
          aria-hidden
          sx={{
            display: "inline-flex",
            p: 0.75,
            borderRadius: 1,
            bgcolor: iconBg[iconColor],
            color: iconFg[iconColor],
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: "0.04em" }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}
      >
        {value}
      </Typography>
      {hint && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {hint}
        </Typography>
      )}
    </Box>
  );
}
