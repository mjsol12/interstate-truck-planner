import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface PanelProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Remove body padding — useful for tables. */
  flush?: boolean;
  id?: string;
}

/** Bordered enterprise panel — matches log sheets / table shell. */
export default function Panel({
  title,
  description,
  action,
  children,
  flush = false,
  id,
}: PanelProps) {
  const hasHeader = Boolean(title || description || action);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        overflow: "hidden",
        height: flush ? undefined : "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {hasHeader && (
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            flexShrink: 0,
          }}
        >
          <Box>
            {title && (
              <Typography
                id={id}
                variant="subtitle1"
                component="h2"
                sx={{ fontWeight: 600, lineHeight: 1.3 }}
              >
                {title}
              </Typography>
            )}
            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: title ? 0.25 : 0 }}
              >
                {description}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}
      <Box sx={{ p: flush ? 0 : 2.5, flex: 1, minHeight: 0 }}>{children}</Box>
    </Box>
  );
}
