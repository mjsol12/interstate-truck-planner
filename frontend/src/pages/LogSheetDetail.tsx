import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEffect, useState } from 'react'
import EldLogSheet from '../components/EldLogSheet'
import LogSegmentsTable from '../components/logs/LogSegmentsTable'
import PageHeader from '../components/ui/PageHeader'
import LoadingState from '../components/ui/LoadingState'
import { getTrip } from '../api/trips'
import type { LogSheet, TripResponse } from '../types/trip'

export default function LogSheetDetail() {
  const { tripId, dayNumber } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<TripResponse | null>(null)
  const [sheet, setSheet] = useState<LogSheet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const id = Number(tripId)
      const day = Number(dayNumber)
      if (!Number.isFinite(id) || !Number.isFinite(day)) {
        setError('Invalid log sheet link.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const data = await getTrip(id)
        const match = data.route_data?.log_sheets?.find((s) => s.day_number === day) ?? null
        if (!match) {
          setError(`Day ${day} log sheet was not found for trip #${id}.`)
          setTrip(data)
          setSheet(null)
        } else {
          setTrip(data)
          setSheet(match)
        }
      } catch {
        setError('Could not load log sheet. Make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [tripId, dayNumber])

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <PageHeader
          title={sheet ? `Day ${sheet.day_number} log sheet` : 'Log sheet details'}
          description={
            trip && sheet
              ? `${trip.pickup_location} → ${trip.dropoff_location} · ${sheet.date_display}`
              : 'FMCSA driver daily log with duty segments.'
          }
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/logs')}
          sx={{ mt: { xs: 0, md: 1 } }}
        >
          Back to list
        </Button>
      </Box>

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <EldLogSheet sheet={sheet} />
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Duty segments — Day {sheet.day_number}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {sheet.remarks}
              </Typography>
              <LogSegmentsTable segments={sheet.segments} dayLabel={`Day ${sheet.day_number}`} />
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  )
}
