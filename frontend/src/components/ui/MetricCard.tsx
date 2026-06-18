import type { ElementType } from "react";
import { Box, Typography } from "@mui/material";
import type { SvgIconProps } from "@mui/material/SvgIcon";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: ElementType<SvgIconProps>;
}

export default function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
}: MetricCardProps) {
  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography
          component="dt"
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontSize: "0.6875rem",
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>
        {Icon && (
          <Box
            aria-hidden
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: "primary.light",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
        )}
      </Box>
      <Typography
        component="dd"
        variant="h5"
        sx={{
          m: 0,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {value}
        {unit && (
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ ml: 0.5, fontWeight: 500 }}
          >
            {unit}
          </Typography>
        )}
      </Typography>
    </Box>
  );
}
