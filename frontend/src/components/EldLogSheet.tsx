import { Box } from "@mui/material";
import EldLogSheetGraph from "./eld/EldLogSheetGraph";
import Panel from "./ui/Panel";
import type { LogSheet } from "../types/trip";

interface EldLogSheetProps {
  sheet: LogSheet;
}

export default function EldLogSheet({ sheet }: EldLogSheetProps) {
  const labelId = `log-sheet-${sheet.day_number}-title`;

  return (
    <Panel
      id={labelId}
      title="ELD daily log"
      description={`FMCSA duty-status timeline for ${sheet.date_display}`}
    >
      <Box
        component="article"
        aria-labelledby={labelId}
        sx={{
          display: "flex",
          justifyContent: "center",
          overflowX: "auto",
          mx: -1,
          px: 1,
        }}
      >
        <EldLogSheetGraph sheet={sheet} />
      </Box>
    </Panel>
  );
}
