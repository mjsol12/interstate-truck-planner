import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { Box, Typography, Paper } from '@mui/material'
import 'leaflet/dist/leaflet.css'

const US_CENTER: LatLngExpression = [39.8283, -98.5795]
const DEFAULT_ZOOM = 4

// Placeholder markers — will be replaced with geocoded trip locations
const placeholderMarkers: { position: LatLngExpression; label: string }[] = []

// Placeholder route polyline — will be populated from OSRM route geometry
const placeholderRoute: LatLngExpression[] = []

export default function MapView() {
  return (
    <Paper elevation={1} sx={{ overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">Route Map</Typography>
        <Typography variant="body2" color="text.secondary">
          Map will display route, stops, and rest breaks once route planning is implemented.
        </Typography>
      </Box>
      <Box sx={{ height: 400 }}>
        <MapContainer
          center={US_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {placeholderRoute.length > 0 && (
            <Polyline positions={placeholderRoute} color="#1565c0" weight={4} />
          )}
          {placeholderMarkers.map((marker) => (
            <Marker key={marker.label} position={marker.position}>
              <Popup>{marker.label}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Paper>
  )
}
