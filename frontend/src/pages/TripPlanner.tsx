import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import MapView from '../components/MapView'
import { createTrip } from '../api/trips'
import type { TripRequest, TripResponse } from '../types/trip'

const initialForm: TripRequest = {
  current_location: '',
  pickup_location: '',
  dropoff_location: '',
  current_cycle_used_hrs: 0,
}

export default function TripPlanner() {
  const [form, setForm] = useState<TripRequest>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TripResponse | null>(null)

  const handleChange = (field: keyof TripRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      field === 'current_cycle_used_hrs'
        ? parseFloat(event.target.value) || 0
        : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const trip = await createTrip(form)
      setResult(trip)
    } catch {
      setError('Failed to create trip. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trip Planner
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Enter trip details to plan your route and generate ELD log sheets.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Current Location"
                  value={form.current_location}
                  onChange={handleChange('current_location')}
                  required
                  fullWidth
                  placeholder="e.g. Chicago, IL"
                />
                <TextField
                  label="Pickup Location"
                  value={form.pickup_location}
                  onChange={handleChange('pickup_location')}
                  required
                  fullWidth
                  placeholder="e.g. Dallas, TX"
                />
                <TextField
                  label="Dropoff Location"
                  value={form.dropoff_location}
                  onChange={handleChange('dropoff_location')}
                  required
                  fullWidth
                  placeholder="e.g. Los Angeles, CA"
                />
                <TextField
                  label="Current Cycle Used (Hrs)"
                  type="number"
                  value={form.current_cycle_used_hrs}
                  onChange={handleChange('current_cycle_used_hrs')}
                  required
                  fullWidth
                  slotProps={{ htmlInput: { min: 0, max: 70, step: 0.5 } }}
                  helperText="Hours used in current 70/8 cycle (max 70)"
                />
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? 'Planning...' : 'Plan Trip'}
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Trip #{result.id} created — {result.message}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <MapView />
        </Grid>
      </Grid>
    </Box>
  )
}
