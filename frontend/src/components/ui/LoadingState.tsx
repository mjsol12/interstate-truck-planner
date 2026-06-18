import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({
  label = "Loading…",
}: LoadingStateProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 8, md: 10 },
        gap: 2,
      }}
    >
      <CircularProgress size={40} aria-hidden />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
