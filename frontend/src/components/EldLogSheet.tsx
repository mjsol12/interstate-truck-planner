import { Box, Typography } from "@mui/material";
import EldLogSheetGraph from "./eld/EldLogSheetGraph";
import type { LogSheet } from "../types/trip";

interface EldLogSheetProps {
  sheet: LogSheet;
}

export default function EldLogSheet({ sheet }: EldLogSheetProps) {
  const labelId = `log-sheet-${sheet.day_number}-title`;

  return (
    <Box
      component="article"
      aria-labelledby={labelId}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" component="h3" id={labelId} gutterBottom>
        Day {sheet.day_number} — {sheet.date_display}
      </Typography>
      <EldLogSheetGraph sheet={sheet} />
    </Box>
  );
}
