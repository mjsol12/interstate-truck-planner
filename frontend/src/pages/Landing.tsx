import { useEffect, useState, type ElementType } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ThemeToggleButton from "../components/layout/ThemeToggleButton";
import StatCard from "../components/ui/StatCard";
import { getTripAnalytics } from "../api/analytics";
import type { AnalyticsOverview } from "../types/analytics";
import { tokens } from "../theme/tokens";

type AppArea = {
  title: string;
  description: string;
  to: string;
  cta: string;
  Icon: ElementType<SvgIconProps>;
  primary?: boolean;
};

const appAreas: AppArea[] = [
  {
    title: "Dashboard",
    description:
      "Overview of trips, compliance defaults, and shortcuts into the main workflows.",
    to: "/home",
    cta: "Open dashboard",
    Icon: HomeOutlinedIcon,
    primary: true,
  },
  {
    title: "Planner",
    description:
      "Enter locations and cycle hours to generate HOS-compliant routes, stops, and log sheets.",
    to: "/planner",
    cta: "Plan a trip",
    Icon: RouteOutlinedIcon,
  },
  {
    title: "Analytics",
    description:
      "Review fleet metrics, trip status breakdowns, distance leaders, and recent activity.",
    to: "/analytics",
    cta: "View analytics",
    Icon: BarChartOutlinedIcon,
  },
  {
    title: "Log Sheets",
    description:
      "Browse daily FMCSA grids, preview ELD timelines, and open full sheet details.",
    to: "/logs",
    cta: "Browse log sheets",
    Icon: DescriptionOutlinedIcon,
  },
];

const usageSteps = [
  {
    step: "01",
    title: "Configure a trip",
    description:
      "Set current location, pickup, dropoff, and hours already used on the 70/8 property cycle.",
  },
  {
    step: "02",
    title: "Generate the route",
    description:
      "The backend geocodes stops, calls OSRM for driving geometry, and inserts fuel and rest breaks.",
  },
  {
    step: "03",
    title: "Review compliance output",
    description:
      "Inspect mapped legs, stop markers, cycle usage, and warnings on the planner and analytics pages.",
  },
  {
    step: "04",
    title: "Work with ELD logs",
    description:
      "Daily log sheets are produced per trip day with duty segments, remarks, and FMCSA-style grids.",
  },
];

const capabilities = [
  "Leaflet map with route polyline and stop markers",
  "HOS calculator for 70-hour / 8-day rules",
  "Fuel stops planned every 1,000 miles",
  "Pickup and dropoff on-duty time included",
  "Multi-day FMCSA ELD log sheet generation",
  "Analytics dashboard over stored trips",
];

const stackChips = ["Django REST", "React + TypeScript", "Material UI", "Leaflet", "SQLite"];

function AppAreaCard({ area }: { area: AppArea }) {
  const { Icon } = area;

  return (
    <Box
      sx={{
        height: "100%",
        p: 2.5,
        borderRadius: `${tokens.radius.md}px`,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? tokens.dark.shadowMd
              : tokens.shadow.md,
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 44,
          borderRadius: `${tokens.radius.sm}px`,
          bgcolor: "primary.light",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.5,
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
      </Box>
      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.75 }}>
        {area.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
        {area.description}
      </Typography>
      <Button
        variant={area.primary ? "contained" : "outlined"}
        size="small"
        component={RouterLink}
        to={area.to}
        endIcon={<ArrowForwardIcon fontSize="small" />}
        sx={{ alignSelf: "flex-start" }}
      >
        {area.cta}
      </Button>
    </Box>
  );
}

export default function Landing() {
  const theme = useTheme();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    getTripAnalytics()
      .then((data) => setOverview(data.overview))
      .catch(() => setOverview(null));
  }, []);

  const hasUsage = overview && overview.total_trips > 0;

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        bgcolor: "background.default",
      }}
    >
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.5,
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: `${tokens.radius.sm}px`,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocalShippingOutlinedIcon aria-hidden />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  ELD Trip Planner
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  FMCSA route &amp; daily logs
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <ThemeToggleButton />
              <Button
                variant="contained"
                size="small"
                component={RouterLink}
                to="/home"
                endIcon={<ArrowForwardIcon fontSize="small" />}
              >
                Open app
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(70, 95, 255, 0.14) 0%, transparent 100%)"
              : `linear-gradient(180deg, ${tokens.colors.primaryLight} 0%, transparent 100%)`,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="overline"
                color="primary"
                sx={{ fontWeight: 700, letterSpacing: "0.08em" }}
              >
                Full-stack assessment project
              </Typography>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  mt: 1,
                  mb: 2,
                }}
              >
                Plan compliant trips and produce daily ELD log sheets
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 560, lineHeight: 1.6, mb: 3 }}
              >
                This app was built to take trip inputs, calculate HOS-aware routes with
                fuel and rest stops, visualize the journey on a map, and generate FMCSA-style
                driver logs for every day of the trip.
              </Typography>
              <Stack
                direction="row"
                useFlexGap
                spacing={1.5}
                sx={{ flexWrap: "wrap" }}
              >
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/planner"
                  startIcon={<RouteOutlinedIcon />}
                >
                  Start in planner
                </Button>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/home"
                  startIcon={<HomeOutlinedIcon />}
                >
                  Go to dashboard
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: `${tokens.radius.lg}px`,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? tokens.dark.shadowMd
                      : tokens.shadow.md,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Typical usage flow
                </Typography>
                <Stack spacing={1.25}>
                  {usageSteps.slice(0, 3).map((step) => (
                    <Stack
                      key={step.step}
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "flex-start" }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          minWidth: 24,
                          pt: 0.25,
                        }}
                      >
                        {step.step}
                      </Typography>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {step.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {hasUsage && (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
            How it has been used
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Live counts from trips stored in the backend during development and testing.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard label="Trips planned" value={String(overview!.total_trips)} />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard
                label="Miles routed"
                value={String(overview!.total_miles)}
                unit="mi"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard
                label="Log sheets"
                value={String(overview!.total_log_sheets)}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard
                label="Success rate"
                value={String(overview!.success_rate)}
                unit="%"
              />
            </Grid>
          </Grid>
        </Container>
      )}

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
          How the project is used
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
          From trip configuration through compliance review, each step maps to a page inside
          the main application shell with sidebar navigation.
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {usageSteps.map((step) => (
            <Grid key={step.step} size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  height: "100%",
                  p: 2.5,
                  borderRadius: `${tokens.radius.md}px`,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Typography
                  variant="overline"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  Step {step.step}
                </Typography>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.75 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
          Open a section
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          These pages use the app layout with sidebar navigation.
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {appAreas.map((area) => (
            <Grid key={area.title} size={{ xs: 12, sm: 6 }}>
              <AppAreaCard area={area} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: `${tokens.radius.md}px`,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1.5 }}>
                What the project delivers
              </Typography>
              <Stack spacing={1}>
                {capabilities.map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "flex-start" }}
                  >
                    <CheckCircleOutlinedIcon
                      sx={{ fontSize: 18, color: "success.main", mt: 0.25 }}
                      aria-hidden
                    />
                    <Typography variant="body2">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: `${tokens.radius.md}px`,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1.5 }}>
                Compliance assumptions
              </Typography>
              <Stack spacing={1.25} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Property-carrying driver on a <strong>70 hrs / 8 days</strong> cycle.
                </Typography>
                <Typography variant="body2">
                  Fueling at least once every <strong>1,000 miles</strong>.
                </Typography>
                <Typography variant="body2">
                  <strong>1 hour</strong> on duty for pickup and dropoff each.
                </Typography>
              </Stack>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Stack
              </Typography>
              <Stack
                direction="row"
                useFlexGap
                spacing={1}
                sx={{ flexWrap: "wrap" }}
              >
                {stackChips.map((chip) => (
                  <Chip key={chip} label={chip} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box
        component="footer"
        sx={{
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ELD Trip Planner — assessment app for FMCSA route planning and daily logs.
            </Typography>
            <Button
              variant="contained"
              size="small"
              component={RouterLink}
              to="/home"
              endIcon={<ArrowForwardIcon fontSize="small" />}
            >
              Enter application
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
