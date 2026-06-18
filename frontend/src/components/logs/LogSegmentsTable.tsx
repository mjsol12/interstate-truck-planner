import { Chip } from "@mui/material";
import type { LogSegment } from "../../types/trip";
import {
  AppTable,
  AppTableBody,
  AppTableCell,
  AppTableEmptyRow,
  AppTableHead,
  AppTableHeadCell,
  AppTableRow,
  TableSurface,
} from "../ui/table/AppTable";

const STATUS_LABELS: Record<LogSegment["status"], string> = {
  off_duty: "Off duty",
  sleeper: "Sleeper",
  driving: "Driving",
  on_duty: "On duty",
};

const STATUS_COLORS: Record<
  LogSegment["status"],
  "default" | "primary" | "success" | "warning"
> = {
  off_duty: "default",
  sleeper: "default",
  driving: "primary",
  on_duty: "warning",
};

interface LogSegmentsTableProps {
  segments: LogSegment[];
  dayLabel?: string;
}

function formatHour(h: number) {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs}:${String(mins).padStart(2, "0")}`;
}

export default function LogSegmentsTable({
  segments,
  dayLabel,
}: LogSegmentsTableProps) {
  return (
    <TableSurface>
      <AppTable
        aria-label={
          dayLabel ? `Duty segments for ${dayLabel}` : "Duty segments"
        }
        minWidth={560}
      >
        <AppTableHead>
          <AppTableRow>
            <AppTableHeadCell>Status</AppTableHeadCell>
            <AppTableHeadCell>Activity</AppTableHeadCell>
            <AppTableHeadCell align="right">Start</AppTableHeadCell>
            <AppTableHeadCell align="right">End</AppTableHeadCell>
            <AppTableHeadCell align="right">Duration</AppTableHeadCell>
          </AppTableRow>
        </AppTableHead>
        <AppTableBody>
          {segments.length === 0 ? (
            <AppTableEmptyRow
              colSpan={5}
              message="No duty segments recorded for this day."
            />
          ) : (
            segments.map((segment, index) => {
              const duration = segment.end - segment.start;
              return (
                <AppTableRow key={`${segment.label}-${index}`}>
                  <AppTableCell nowrap>
                    <Chip
                      label={STATUS_LABELS[segment.status]}
                      size="small"
                      color={STATUS_COLORS[segment.status]}
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </AppTableCell>
                  <AppTableCell>{segment.label}</AppTableCell>
                  <AppTableCell align="right" nowrap>
                    {formatHour(segment.start)}
                  </AppTableCell>
                  <AppTableCell align="right" nowrap>
                    {formatHour(segment.end)}
                  </AppTableCell>
                  <AppTableCell align="right" nowrap muted>
                    {duration.toFixed(2)} hrs
                  </AppTableCell>
                </AppTableRow>
              );
            })
          )}
        </AppTableBody>
      </AppTable>
    </TableSurface>
  );
}
