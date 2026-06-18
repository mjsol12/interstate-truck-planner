import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useMemo, useState } from "react";
import EldLogSheet from "../components/EldLogSheet";
import LogSegmentsTable from "../components/logs/LogSegmentsTable";
import LogSheetDetailStats from "../components/logs/LogSheetDetailStats";
import LogSheetOverview from "../components/logs/LogSheetOverview";
import PageHeader from "../components/ui/PageHeader";
import PageToolbar from "../components/ui/PageToolbar";
import Panel from "../components/ui/Panel";
import LoadingState from "../components/ui/LoadingState";
import { LogQuoteCard } from "../components/ui/table/TableTooltipCell";
import { getTrip } from "../api/trips";
import { segmentActivitySummary } from "../utils/logSheetMetrics";
import type { LogSheet, TripResponse } from "../types/trip";

function getAdjacentSheets(trip: TripResponse, dayNumber: number) {
  const sheets = trip.route_data?.log_sheets ?? [];
  const index = sheets.findIndex((sheet) => sheet.day_number === dayNumber);
  if (index < 0) {
    return { sheets, index: -1, prev: null, next: null };
  }
  return {
    sheets,
    index,
    prev: index > 0 ? sheets[index - 1] : null,
    next: index < sheets.length - 1 ? sheets[index + 1] : null,
  };
}

export default function LogSheetDetail() {
  const { tripId, dayNumber } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [sheet, setSheet] = useState<LogSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const id = Number(tripId);
      const day = Number(dayNumber);
      if (!Number.isFinite(id) || !Number.isFinite(day)) {
        setError("Invalid log sheet link.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getTrip(id);
        const match =
          data.route_data?.log_sheets?.find((s) => s.day_number === day) ?? null;
        if (!match) {
          setError(`Day ${day} log sheet was not found for trip #${id}.`);
          setTrip(data);
          setSheet(null);
        } else {
          setTrip(data);
          setSheet(match);
        }
      } catch {
        setError("Could not load log sheet. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tripId, dayNumber]);

  const navigation = useMemo(() => {
    if (!trip || !sheet) return null;
    return getAdjacentSheets(trip, sheet.day_number);
  }, [trip, sheet]);

  const activities = sheet ? segmentActivitySummary(sheet.segments) : "";
  const remarks = sheet?.remarks.trim() ?? "";

  const goToDay = (day: number) => {
    if (!trip) return;
    navigate(`/logs/${trip.id}/${day}`);
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
      <Breadcrumbs sx={{ mb: 2 }} aria-label="Breadcrumb">
        <Link component={RouterLink} to="/logs" underline="hover" color="inherit">
          Log sheets
        </Link>
        {trip && sheet && (
          <Typography color="text.primary">
            Trip #{trip.id} · Day {sheet.day_number}
          </Typography>
        )}
      </Breadcrumbs>

      <PageToolbar
        actions={
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: "wrap" }}
          >
            {navigation && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ChevronLeftIcon />}
                  disabled={!navigation.prev}
                  onClick={() =>
                    navigation.prev && goToDay(navigation.prev.day_number)
                  }
                >
                  Day {navigation.prev?.day_number ?? "—"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ChevronRightIcon />}
                  disabled={!navigation.next}
                  onClick={() =>
                    navigation.next && goToDay(navigation.next.day_number)
                  }
                >
                  Day {navigation.next?.day_number ?? "—"}
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/logs")}
            >
              Back to list
            </Button>
          </Stack>
        }
      >
        <PageHeader
          title={sheet ? `Day ${sheet.day_number} log sheet` : "Log sheet details"}
          description={
            trip && sheet
              ? `${trip.pickup_location} → ${trip.dropoff_location} · ${sheet.date_display}`
              : "FMCSA driver daily log with duty segments."
          }
        />
      </PageToolbar>

      {loading && <LoadingState label="Loading log sheet…" />}

      {!loading && error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" component={RouterLink} to="/logs">
              Back to list
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!loading && sheet && trip && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <LogSheetDetailStats sheet={sheet} />

          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <EldLogSheet sheet={sheet} />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2} sx={{ height: "100%" }}>
                <Panel title="Day overview" description="Trip and route context">
                  <LogSheetOverview trip={trip} sheet={sheet} />
                </Panel>

                {remarks && (
                  <Panel title="Remarks" description="Driver daily note">
                    <LogQuoteCard label="Remarks" text={remarks} />
                  </Panel>
                )}

                {activities !== "—" && (
                  <Panel title="Activities" description="Segment activity summary">
                    <LogQuoteCard
                      label="Activities"
                      text={activities}
                      listStyle
                    />
                  </Panel>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Panel
            title="Duty segments"
            description={`${sheet.segments.length} recorded ${
              sheet.segments.length === 1 ? "entry" : "entries"
            } for Day ${sheet.day_number}`}
            flush
          >
            <LogSegmentsTable
              segments={sheet.segments}
              dayLabel={`Day ${sheet.day_number}`}
            />
          </Panel>
        </Box>
      )}
    </Box>
  );
}
