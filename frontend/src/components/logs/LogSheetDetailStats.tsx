import Grid from "@mui/material/Grid";
import StatCard from "../ui/StatCard";
import type { LogSheet } from "../../types/trip";
import { formatDutyHours, sumSegmentHours } from "../../utils/logSheetMetrics";

interface LogSheetDetailStatsProps {
  sheet: LogSheet;
}

export default function LogSheetDetailStats({ sheet }: LogSheetDetailStatsProps) {
  const offDuty = sumSegmentHours(sheet.segments, "off_duty");
  const sleeper = sumSegmentHours(sheet.segments, "sleeper");
  const driving = sumSegmentHours(sheet.segments, "driving");
  const onDuty = sumSegmentHours(sheet.segments, "on_duty");
  const totalLogged = offDuty + sleeper + driving + onDuty;

  return (
    <Grid container spacing={1.5} sx={{ mb: 3 }}>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Miles" value={String(sheet.total_miles)} unit="mi" />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard
          label="Segments"
          value={String(sheet.segments.length)}
          unit={sheet.segments.length === 1 ? "entry" : "entries"}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Off duty" value={formatDutyHours(offDuty)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Sleeper" value={formatDutyHours(sleeper)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Driving" value={formatDutyHours(driving)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="On duty" value={formatDutyHours(onDuty)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <StatCard label="Total logged" value={formatDutyHours(totalLogged)} unit="/ 24 hrs" />
      </Grid>
    </Grid>
  );
}
