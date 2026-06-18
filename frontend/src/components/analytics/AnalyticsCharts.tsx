import { Box, LinearProgress, Typography } from "@mui/material";
import type {
  DailyTripCount,
  StatusBreakdown,
  StopTotals,
} from "../../types/analytics";
import { tokens } from "../../theme/tokens";

const STATUS_COLORS: Record<string, string> = {
  completed: tokens.colors.success,
  failed: tokens.colors.error,
  pending: tokens.colors.warning,
};

interface BarChartProps {
  data: DailyTripCount[];
}

export function TripsBarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 0.75,
        height: 180,
        pt: 0.5,
      }}
      role="img"
      aria-label={`Bar chart: trips per day over ${data.length} days`}
    >
      {data.map((day) => (
        <Box
          key={day.date}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            minWidth: 0,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.65rem", fontWeight: 600 }}
          >
            {day.count > 0 ? day.count : ""}
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 28,
              height: `${Math.max((day.count / max) * 100, day.count > 0 ? 8 : 2)}%`,
              minHeight: day.count > 0 ? 8 : 2,
              bgcolor: day.count > 0 ? "primary.main" : "action.hover",
              borderRadius: 0.75,
              transition: "height 0.3s ease",
            }}
            title={`${day.label}: ${day.count} trips`}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.6rem", display: { xs: "none", sm: "block" } }}
            noWrap
          >
            {day.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

interface StatusChartProps {
  data: StatusBreakdown[];
  total: number;
}

export function StatusBreakdownChart({ data, total }: StatusChartProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
      {data.map((item) => {
        const pct = total > 0 ? (item.count / total) * 100 : 0;
        return (
          <Box key={item.status}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.75,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.count} · {pct.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={pct}
              aria-label={`${item.label}: ${item.count} trips`}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  bgcolor: STATUS_COLORS[item.status] ?? "primary.main",
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

interface StopChartProps {
  data: StopTotals;
}

export function StopTotalsChart({ data }: StopChartProps) {
  const items = [
    { key: "fuel", label: "Fuel stops", color: tokens.map.stops.fuel },
    { key: "rest", label: "Rest stops", color: tokens.map.stops.rest },
    { key: "break", label: "Break stops", color: tokens.map.stops.break },
  ] as const;

  const total = items.reduce((sum, i) => sum + data[i.key], 0);
  const max = Math.max(...items.map((i) => data[i.key]), 1);

  if (total === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No stop data yet. Complete a trip to see fuel, rest, and break totals.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
      {items.map((item) => (
        <Box key={item.key}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {item.label}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              {data[item.key]}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(data[item.key] / max) * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "action.hover",
              "& .MuiLinearProgress-bar": {
                bgcolor: item.color,
                borderRadius: 3,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
