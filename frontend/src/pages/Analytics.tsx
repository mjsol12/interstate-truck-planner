import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Typography,
} from '@mui/material'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import PageHeader from '../components/ui/PageHeader'
import PageToolbar from '../components/ui/PageToolbar'
import Panel from '../components/ui/Panel'
import MetricCard from '../components/ui/MetricCard'
import InsightTile from '../components/ui/InsightTile'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import { StatusBreakdownChart, StopTotalsChart, TripsBarChart } from '../components/analytics/AnalyticsCharts'
import {
  AppTable,
  AppTableBody,
  AppTableCell,
  AppTableHead,
  AppTableHeadCell,
  AppTableRow,
  TableSurface,
} from '../components/ui/table/AppTable'
import { getTripAnalytics } from '../api/analytics'
import type { TripAnalytics } from '../types/analytics'

const statusColor: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  completed: 'success',
  failed: 'error',
  pending: 'warning',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Analytics() {
  const [data, setData] = useState<TripAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getTripAnalytics())
    } catch {
      setError('Could not load analytics. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const overview = data?.overview

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
      <PageToolbar
        actions={
          <>
            <Button
              variant="outlined"
              size="small"
              component={RouterLink}
              to="/planner"
              startIcon={<RouteOutlinedIcon />}
            >
              Open planner
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={load}
              disabled={loading}
            >
              Refresh
            </Button>
          </>
        }
      >
        <PageHeader
          title="Analytics"
          description="Fleet operations overview — trip volume, compliance metrics, and route performance."
        />
      </PageToolbar>

      {loading && <LoadingState label="Loading analytics…" />}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={load}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {!loading && data && overview && (
        <>
          {overview.total_trips === 0 ? (
            <Panel>
              <EmptyState
                icon={<BarChartOutlinedIcon />}
                title="No fleet data yet"
                description="Plan your first trip to unlock trip volume, HOS insights, and route analytics."
                action={{ label: 'Open planner', href: '/planner' }}
              />
            </Panel>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <MetricCard label="Total trips" value={String(overview.total_trips)} icon={LocalShippingOutlinedIcon} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <MetricCard label="Success rate" value={`${overview.success_rate}`} unit="%" icon={CheckCircleOutlinedIcon} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <MetricCard label="Total miles" value={String(overview.total_miles)} unit="mi" icon={StraightenOutlinedIcon} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <MetricCard label="Avg distance" value={String(overview.avg_distance_miles)} unit="mi" icon={StraightenOutlinedIcon} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <MetricCard label="Avg trip time" value={String(overview.avg_duration_hrs)} unit="hrs" icon={ScheduleOutlinedIcon} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                  <MetricCard label="Log sheets" value={String(overview.total_log_sheets)} icon={DescriptionOutlinedIcon} />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Panel title="Trip volume" description="Planned trips over the last 14 days">
                    <TripsBarChart data={data.trips_by_day} />
                  </Panel>
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Panel title="Status breakdown" description="Completed, pending, and failed trips">
                    <StatusBreakdownChart data={data.trips_by_status} total={overview.total_trips} />
                  </Panel>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Panel title="Planned stops" description="Aggregate fuel, rest, and break stops">
                    <StopTotalsChart data={data.stop_totals} />
                  </Panel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Panel title="HOS & cycle insights" description="70-hour / 8-day property-carrying rule">
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <InsightTile
                          icon={ScheduleOutlinedIcon}
                          label="Avg cycle at start"
                          value={`${overview.avg_cycle_used_hrs} hrs`}
                          hint="Hours used before trip departure"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <InsightTile
                          icon={TrendingUpOutlinedIcon}
                          label="Avg cycle after trip"
                          value={`${overview.avg_cycle_hours_after_trip} hrs`}
                          hint="Projected hours used post-trip"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <InsightTile
                          icon={CheckCircleOutlinedIcon}
                          iconColor="success"
                          label="Completed trips"
                          value={overview.completed_trips}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <InsightTile
                          icon={StraightenOutlinedIcon}
                          label="Longest trip"
                          value={`${data.distance_leaders[0]?.total_distance_miles ?? 0} mi`}
                          hint={
                            data.distance_leaders[0]
                              ? `${data.distance_leaders[0].pickup_location} → ${data.distance_leaders[0].dropoff_location}`
                              : undefined
                          }
                        />
                      </Grid>
                    </Grid>
                  </Panel>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 7 }}>
                  <Panel title="Recent trips" description="Latest planned routes" flush>
                    <TableSurface plain sx={{ border: 'none', borderRadius: 0 }}>
                      <AppTable aria-label="Recent trips" minWidth={640}>
                        <AppTableHead sticky>
                          <AppTableRow>
                            <AppTableHeadCell>Route</AppTableHeadCell>
                            <AppTableHeadCell>Status</AppTableHeadCell>
                            <AppTableHeadCell align="right">Miles</AppTableHeadCell>
                            <AppTableHeadCell align="right">Hours</AppTableHeadCell>
                            <AppTableHeadCell>Created</AppTableHeadCell>
                          </AppTableRow>
                        </AppTableHead>
                        <AppTableBody>
                          {data.recent_trips.map((trip) => (
                            <AppTableRow key={trip.id}>
                              <AppTableCell title={`${trip.pickup_location} → ${trip.dropoff_location}`}>
                                {trip.pickup_location} → {trip.dropoff_location}
                              </AppTableCell>
                              <AppTableCell>
                                <Chip
                                  label={trip.status}
                                  size="small"
                                  variant="outlined"
                                  color={statusColor[trip.status] ?? 'default'}
                                  sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                                />
                              </AppTableCell>
                              <AppTableCell align="right" nowrap>
                                {trip.total_distance_miles ?? '—'}
                              </AppTableCell>
                              <AppTableCell align="right" nowrap>
                                {trip.total_duration_hrs ?? '—'}
                              </AppTableCell>
                              <AppTableCell nowrap>{formatDate(trip.created_at)}</AppTableCell>
                            </AppTableRow>
                          ))}
                        </AppTableBody>
                      </AppTable>
                    </TableSurface>
                  </Panel>
                </Grid>
                <Grid size={{ xs: 12, lg: 5 }}>
                  <Panel
                    title="Top routes"
                    description="Longest completed trips by distance"
                    action={
                      <Button component={RouterLink} to="/logs" size="small" variant="text">
                        View logs
                      </Button>
                    }
                  >
                    {data.distance_leaders.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No completed routes yet.
                      </Typography>
                    ) : (
                      <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                        {data.distance_leaders.map((trip, i) => (
                          <Box
                            component="li"
                            key={trip.id}
                            sx={{
                              display: 'flex',
                              gap: 1.5,
                              py: 1.5,
                              borderBottom: 1,
                              borderColor: 'divider',
                              '&:last-child': { borderBottom: 0 },
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                minWidth: 20,
                                pt: 0.25,
                              }}
                            >
                              {i + 1}
                            </Typography>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {trip.total_distance_miles} mi · {trip.total_duration_hrs} hrs
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap title={`${trip.pickup_location} → ${trip.dropoff_location}`}>
                                {trip.pickup_location} → {trip.dropoff_location}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                    <Button
                      component={RouterLink}
                      to="/planner"
                      variant="outlined"
                      size="small"
                      startIcon={<RouteOutlinedIcon />}
                      sx={{ mt: 2 }}
                    >
                      Plan new trip
                    </Button>
                  </Panel>
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </Box>
  )
}
