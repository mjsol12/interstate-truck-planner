import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import RouteIcon from '@mui/icons-material/Route'
import DescriptionIcon from '@mui/icons-material/Description'

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ELD Trip Planner
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
        Plan truck trips with route instructions, rest stops, and FMCSA-compliant
        daily log sheets. Enter your trip details to get started.
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 280px', maxWidth: 400 }}>
          <CardContent>
            <RouteIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Trip Planner
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter current location, pickup, dropoff, and cycle hours to plan your route.
            </Typography>
            <Button variant="contained" component={RouterLink} to="/planner">
              Start Planning
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 280px', maxWidth: 400 }}>
          <CardContent>
            <DescriptionIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Log Sheets
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View filled daily ELD log sheets generated for your trip.
            </Typography>
            <Button variant="outlined" component={RouterLink} to="/logs">
              View Log Sheets
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
