import { Box, Grid, Typography } from "@mui/material";
import type { LogSheet, TripResponse } from "../../types/trip";
import { segmentActivitySummary } from "../../utils/logSheetMetrics";

interface LogSheetOverviewProps {
  trip: TripResponse;
  sheet: LogSheet;
}

function OverviewField({
  label,
  value,
  title,
}: {
  label: string;
  value: string;
  title?: string;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        component="dt"
        sx={{ display: "block", mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        component="dd"
        title={title ?? value}
        sx={{ m: 0, fontWeight: 500, lineHeight: 1.45 }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function LogSheetOverview({ trip, sheet }: LogSheetOverviewProps) {
  const activities = segmentActivitySummary(sheet.segments);
  const sheetCount = trip.route_data?.log_sheets?.length ?? 0;

  return (
    <Box component="dl" sx={{ m: 0 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <OverviewField label="Trip" value={`#${trip.id}`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <OverviewField
            label="Day"
            value={`${sheet.day_number} of ${sheetCount || "—"}`}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <OverviewField
            label="Route"
            value={`${trip.pickup_location} → ${trip.dropoff_location}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <OverviewField label="From" value={sheet.from_location} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <OverviewField label="To" value={sheet.to_location} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <OverviewField label="Date" value={sheet.date_display} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <OverviewField label="ISO date" value={sheet.date} />
        </Grid>
        {activities !== "—" && (
          <Grid size={{ xs: 12 }}>
            <OverviewField label="Activities" value={activities} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
