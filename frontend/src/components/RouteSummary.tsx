import {
  Alert,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import StatCard from './ui/StatCard'
import type { RouteData } from '../types/trip'

interface RouteSummaryProps {
  routeData: RouteData
}

export default function RouteSummary({ routeData }: RouteSummaryProps) {
  const { summary, legs, stops } = routeData

  return (
    <Box
      component="section"
      aria-labelledby="route-summary-heading"
      sx={{ pt: 0 }}
    >
      <Typography
        variant="subtitle2"
        component="h2"
        id="route-summary-heading"
        sx={{ fontWeight: 600, mb: 2 }}
      >
        Route summary
      </Typography>

      <Box
        component="dl"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
          gap: 1.5,
          mb: 2,
          m: 0,
        }}
      >
        <StatCard label="Distance" value={String(summary.total_distance_miles)} unit="mi" />
        <StatCard label="Trip time" value={String(summary.total_trip_hrs)} unit="hrs" />
        <StatCard label="Driving" value={String(summary.total_driving_hrs)} unit="hrs" />
        <StatCard label="On-duty" value={String(summary.total_on_duty_hrs)} unit="hrs" />
        <StatCard label="Cycle used" value={`${summary.cycle_hours_used}`} unit="/ 70 hrs" />
        <StatCard label="Remaining" value={String(summary.remaining_cycle_hrs)} unit="hrs" />
      </Box>

      {summary.warnings.map((warning) => (
        <Alert key={warning} severity="warning" sx={{ mb: 2 }} role="alert">
          {warning}
        </Alert>
      ))}

      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Route legs
      </Typography>
      <List dense disablePadding aria-label="Route legs">
        {legs.map((leg) => (
          <ListItem key={`${leg.from}-${leg.to}`} disableGutters sx={{ py: 0.75 }}>
            <ListItemText
              primary={`${leg.from} → ${leg.to}`}
              secondary={`${leg.distance_miles} mi · ${leg.duration_hrs} hrs driving`}
              slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 500 } } }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Stops ({stops.length})
      </Typography>
      <List
        dense
        aria-label="Route stops"
        sx={{
          maxHeight: 200,
          overflow: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          px: 1,
        }}
      >
        {stops.map((stop, index) => (
          <ListItem key={`${stop.label}-${index}`} disableGutters sx={{ py: 0.5 }}>
            <ListItemText
              primary={stop.label}
              secondary={`Mile ${stop.cumulative_miles}${stop.duration_hrs ? ` · ${stop.duration_hrs} hr` : ''}`}
              slotProps={{ primary: { variant: 'body2' } }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
