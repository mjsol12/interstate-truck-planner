import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CurrentLocationField from "../components/CurrentLocationField";
import LocationAutocomplete from "../components/LocationAutocomplete";
import MapView from "../components/MapView";
import RouteSummary from "../components/RouteSummary";
import PageHeader from "../components/ui/PageHeader";
import PageToolbar from "../components/ui/PageToolbar";
import Panel from "../components/ui/Panel";
import { createTrip } from "../api/trips";
import { useLocationPinSync } from "../hooks/useLocationPinSync";
import { PLANNER_STOP_COLORS, PLANNER_STOP_LABELS } from "../constants/plannerStops";
import { formatMiles } from "../utils/formatMiles";
import { saveLastTripId } from "../utils/tripStorage";
import type { MapCoordinates } from "../types/location";
import type { TripRequest, TripResponse } from "../types/trip";

const DEFAULT_PINS: Record<"current" | "pickup" | "dropoff", MapCoordinates> = {
  current: { lat: 41.8781, lng: -87.6298 },
  pickup: { lat: 32.7767, lng: -96.797 },
  dropoff: { lat: 34.0522, lng: -118.2437 },
};

const initialForm: TripRequest = {
  current_location: "",
  pickup_location: "",
  dropoff_location: "",
  current_cycle_used_hrs: 0,
};

const complianceRules = [
  { label: "70 / 8 cycle", icon: ScheduleOutlinedIcon },
  { label: "Fuel every 1,000 mi", icon: LocalGasStationOutlinedIcon },
  { label: "1 hr pickup & dropoff", icon: ScheduleOutlinedIcon },
];

function parseCycleHours(value: string): number {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(70, Math.max(0, parsed));
}

export default function Planner() {
  const [form, setForm] = useState<TripRequest>(initialForm);
  const [cycleInput, setCycleInput] = useState("0");
  const currentLocation = useLocationPinSync(DEFAULT_PINS.current);
  const pickupLocation = useLocationPinSync(DEFAULT_PINS.pickup);
  const dropoffLocation = useLocationPinSync(DEFAULT_PINS.dropoff);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TripResponse | null>(null);

  const handleCycleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCycleInput(value);
    }
  };

  const handleCycleBlur = () => {
    const normalized = parseCycleHours(cycleInput);
    setCycleInput(String(normalized));
    setForm((prev) => ({ ...prev, current_cycle_used_hrs: normalized }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const cycleHours = parseCycleHours(cycleInput);
    setCycleInput(String(cycleHours));
    const payload = { ...form, current_cycle_used_hrs: cycleHours };

    try {
      const trip = await createTrip(payload);
      setResult(trip);
      if (trip.id) saveLastTripId(trip.id);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setError(String(err.response.data.detail));
      } else {
        setError("Failed to create trip. Make sure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logSheetCount = result?.route_data?.log_sheets?.length ?? 0;
  const planningPins = result?.route_data
    ? []
    : [
        {
          id: "current" as const,
          label: PLANNER_STOP_LABELS.current,
          position: currentLocation.pin,
          draggable: !loading,
          onMove: (lat: number, lng: number) =>
            currentLocation.handlePinMove(lat, lng, (value) =>
              setForm((prev) => ({ ...prev, current_location: value })),
            ),
          recenter: currentLocation.recenter,
          onRecenterComplete: currentLocation.clearRecenter,
        },
        {
          id: "pickup" as const,
          label: PLANNER_STOP_LABELS.pickup,
          position: pickupLocation.pin,
          draggable: !loading,
          onMove: (lat: number, lng: number) =>
            pickupLocation.handlePinMove(lat, lng, (value) =>
              setForm((prev) => ({ ...prev, pickup_location: value })),
            ),
          recenter: pickupLocation.recenter,
          onRecenterComplete: pickupLocation.clearRecenter,
        },
        {
          id: "dropoff" as const,
          label: PLANNER_STOP_LABELS.dropoff,
          position: dropoffLocation.pin,
          draggable: !loading,
          onMove: (lat: number, lng: number) =>
            dropoffLocation.handlePinMove(lat, lng, (value) =>
              setForm((prev) => ({ ...prev, dropoff_location: value })),
            ),
          recenter: dropoffLocation.recenter,
          onRecenterComplete: dropoffLocation.clearRecenter,
        },
      ];

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
      <PageToolbar
        actions={
          <Button
            variant="outlined"
            size="small"
            component={RouterLink}
            to="/analytics"
            startIcon={<BarChartOutlinedIcon />}
          >
            View analytics
          </Button>
        }
      >
        <PageHeader
          title="Planner"
          description="Configure trip inputs, generate HOS-compliant routes, and produce ELD log sheets."
          id="planner-heading"
        />
      </PageToolbar>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {complianceRules.map((rule) => {
          const Icon = rule.icon;
          return (
            <Chip
              key={rule.label}
              icon={<Icon sx={{ fontSize: "16px !important" }} />}
              label={rule.label}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500, bgcolor: "background.paper" }}
            />
          );
        })}
      </Box>

      <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Panel
            title="Trip configuration"
            description="Required fields for route and HOS calculation"
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              aria-labelledby="planner-heading"
              noValidate
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <CurrentLocationField
                  value={form.current_location}
                  onChange={(value, coords) =>
                    currentLocation.handleLocationChange(value, coords, (next) =>
                      setForm((prev) => ({ ...prev, current_location: next })),
                    )
                  }
                  onBlur={currentLocation.handleLocationBlur}
                  required
                  disabled={loading}
                />
                <LocationAutocomplete
                  label={PLANNER_STOP_LABELS.pickup}
                  name="pickup_location"
                  value={form.pickup_location}
                  indicatorColor={PLANNER_STOP_COLORS.pickup}
                  onChange={(value) =>
                    pickupLocation.handleLocationChange(value, undefined, (next) =>
                      setForm((prev) => ({ ...prev, pickup_location: next })),
                    )
                  }
                  onSelect={(suggestion) =>
                    pickupLocation.handleLocationChange(
                      suggestion.label,
                      { lat: suggestion.lat, lng: suggestion.lng },
                      (next) => setForm((prev) => ({ ...prev, pickup_location: next })),
                    )
                  }
                  onBlur={pickupLocation.handleLocationBlur}
                  required
                  placeholder="e.g. Dallas, TX"
                  disabled={loading}
                />
                <LocationAutocomplete
                  label={PLANNER_STOP_LABELS.dropoff}
                  name="dropoff_location"
                  value={form.dropoff_location}
                  indicatorColor={PLANNER_STOP_COLORS.dropoff}
                  onChange={(value) =>
                    dropoffLocation.handleLocationChange(value, undefined, (next) =>
                      setForm((prev) => ({ ...prev, dropoff_location: next })),
                    )
                  }
                  onSelect={(suggestion) =>
                    dropoffLocation.handleLocationChange(
                      suggestion.label,
                      { lat: suggestion.lat, lng: suggestion.lng },
                      (next) => setForm((prev) => ({ ...prev, dropoff_location: next })),
                    )
                  }
                  onBlur={dropoffLocation.handleLocationBlur}
                  required
                  placeholder="e.g. Los Angeles, CA"
                  disabled={loading}
                />
                <TextField
                  label="Current cycle used"
                  name="current_cycle_used_hrs"
                  type="number"
                  value={cycleInput}
                  onChange={handleCycleChange}
                  onBlur={handleCycleBlur}
                  required
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 70,
                      step: 0.5,
                      "aria-describedby": "cycle-helper",
                    },
                    formHelperText: { id: "cycle-helper" },
                  }}
                  helperText="Hours used in current 70/8 cycle (max 70)"
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2.5 }}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" aria-hidden />
                  ) : undefined
                }
                aria-busy={loading}
              >
                {loading ? "Calculating route…" : "Generate route"}
              </Button>
            </Box>

            <Box role="status" aria-live="polite" sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" role="alert" sx={{ borderRadius: 1 }}>
                  {error}
                </Alert>
              )}

              {result && !error && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Alert
                    severity={
                      result.status === "completed" ? "success" : "info"
                    }
                    sx={{ borderRadius: 1 }}
                  >
                    {result.message}
                  </Alert>
                  {result.status === "completed" && logSheetCount > 0 && (
                    <Button
                      component={RouterLink}
                      to="/logs"
                      variant="outlined"
                      fullWidth
                      size="small"
                    >
                      View {logSheetCount} log sheet
                      {logSheetCount !== 1 ? "s" : ""}
                    </Button>
                  )}
                </Box>
              )}
            </Box>

            {result?.route_data && (
              <>
                <Divider sx={{ my: 2.5 }} />
                <RouteSummary routeData={result.route_data} />
              </>
            )}
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ position: { lg: "sticky" }, top: { lg: 88 } }}>
            <Panel
              title="Route preview"
              description={
                result?.route_data
                  ? `${formatMiles(result.route_data.summary.total_distance_miles)} mi · ${result.route_data.summary.total_trip_hrs} hrs total`
                  : "Drag pins or enter locations in the form"
              }
              flush
            >
              <MapView
                routeData={result?.route_data}
                loading={loading}
                embedded
                planningMode={!result?.route_data}
                plannerPins={planningPins}
              />
            </Panel>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
