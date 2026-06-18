import { useEffect, useState, type ElementType } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import LoadingState from "../components/ui/LoadingState";
import { getTripAnalytics } from "../api/analytics";
import type { AnalyticsOverview } from "../types/analytics";

type QuickLink = {
  title: string;
  description: string;
  to: string;
  cta: string;
  Icon: ElementType<SvgIconProps>;
  primary?: boolean;
};

const quickLinks: QuickLink[] = [
  {
    title: "Analytics",
    description:
      "Trip analytics, fleet metrics, HOS insights, and recent activity.",
    to: "/analytics",
    cta: "View analytics",
    Icon: BarChartOutlinedIcon,
  },
  {
    title: "Planner",
    description:
      "Calculate routes, fuel stops, and rest breaks from your cycle hours.",
    to: "/planner",
    cta: "Open planner",
    Icon: RouteOutlinedIcon,
    primary: true,
  },
  {
    title: "Log Sheets",
    description: "Browse daily FMCSA driver logs generated from planned trips.",
    to: "/logs",
    cta: "View log sheets",
    Icon: DescriptionOutlinedIcon,
  },
];

const complianceStats = [
  { label: "Property cycle", value: "70", unit: "hrs / 8 days" },
  { label: "Fuel interval", value: "1,000", unit: "miles" },
  { label: "Pickup / dropoff", value: "1", unit: "hr each" },
  { label: "Log retention", value: "Daily", unit: "ELD sheets" },
];

const steps = [
  {
    step: "1",
    title: "Plan a trip",
    description:
      "Enter current location, pickup, dropoff, and hours already on your cycle.",
  },
  {
    step: "2",
    title: "Review the route",
    description:
      "See mapped stops, fuel breaks, and HOS-compliant rest periods.",
  },
  {
    step: "3",
    title: "Export log sheets",
    description:
      "Open daily FMCSA grids with duty segments filled from the timeline.",
  },
];

function QuickLinkCard({ link }: { link: QuickLink }) {
  const { Icon } = link;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "primary.main" },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          "&:last-child": { pb: 2.5 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: "primary.light",
            color: "primary.main",
            mb: 1.5,
          }}
        >
          <Icon sx={{ fontSize: 22 }} />
        </Box>
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600, mb: 0.75 }}
        >
          {link.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flex: 1 }}
        >
          {link.description}
        </Typography>
        <Button
          variant={link.primary ? "contained" : "outlined"}
          size="small"
          component={RouterLink}
          to={link.to}
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{ alignSelf: "flex-start" }}
        >
          {link.cta}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTripAnalytics()
      .then((data) => setOverview(data.overview))
      .catch(() => setOverview(null))
      .finally(() => setLoading(false));
  }, []);

  const hasTripData = overview && overview.total_trips > 0;

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <PageHeader
          title="Home"
          description="Plan FMCSA-compliant trips, review routes and stops, and manage daily ELD log sheets."
        />
        <Button
          variant="contained"
          size="small"
          component={RouterLink}
          to="/planner"
          startIcon={<RouteOutlinedIcon />}
          sx={{ alignSelf: "flex-start" }}
        >
          Plan a trip
        </Button>
      </Box>

      {loading && <LoadingState label="Loading overview…" />}

      {!loading && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {hasTripData ? (
              <>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <StatCard
                    label="Total trips"
                    value={String(overview!.total_trips)}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <StatCard
                    label="Total miles"
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
              </>
            ) : (
              complianceStats.map((stat) => (
                <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
                  <StatCard
                    label={stat.label}
                    value={stat.value}
                    unit={stat.unit}
                  />
                </Grid>
              ))
            )}
          </Grid>

          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Quick links
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {quickLinks.map((link) => (
              <Grid key={link.title} size={{ xs: 12, md: 4 }}>
                <QuickLinkCard link={link} />
              </Grid>
            ))}
          </Grid>

          <Card>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
              >
                <Box
                  aria-hidden
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: "background.elevated",
                    border: 1,
                    borderColor: "divider",
                    color: "primary.main",
                  }}
                >
                  <LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 600 }}
                  >
                    How it works
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Three steps from trip input to compliance-ready logs.
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                {steps.map((item) => (
                  <Grid key={item.step} size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: 2,
                        height: "100%",
                        borderRadius: 1,
                        bgcolor: "background.elevated",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="overline"
                        color="primary"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        Step {item.step}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        component="h3"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
