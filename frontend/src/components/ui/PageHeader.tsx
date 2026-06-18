import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  description?: string;
  id?: string;
}

export default function PageHeader({
  title,
  description,
  id,
}: PageHeaderProps) {
  return (
    <Box component="header" sx={{ mb: 0 }}>
      <Typography
        id={id}
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          mb: description ? 0.5 : 0,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 560, lineHeight: 1.45 }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
