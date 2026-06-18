import type { ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Box
      role="status"
      sx={{
        textAlign: "center",
        py: { xs: 6, md: 8 },
        px: 3,
      }}
    >
      <Box
        aria-hidden
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: 2,
          bgcolor: "primary.light",
          color: "primary.main",
          mb: 2,
          "& svg": { fontSize: 32 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 360, mx: "auto" }}
      >
        {description}
      </Typography>
      {action && (
        <Button variant="contained" component={RouterLink} to={action.href}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
