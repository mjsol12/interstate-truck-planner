import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet'
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import type { RouteData, RouteStop } from '../types/trip'
import { tokens } from '../theme/tokens'
import 'leaflet/dist/leaflet.css'

const US_CENTER: LatLngExpression = [39.8283, -98.5795]
const DEFAULT_ZOOM = 4

const STOP_COLORS = tokens.map.stops as Record<RouteStop['type'], string>

const STOP_LABELS: Record<RouteStop['type'], string> = {
  current: 'Current',
  pickup: 'Pickup',
  dropoff: 'Dropoff',
  fuel: 'Fuel',
  rest: 'Rest',
  break: 'Break',
}

interface MapViewProps {
  routeData?: RouteData | null
  loading?: boolean
  /** Render inside a Panel — hides duplicate chrome/header. */
  embedded?: boolean
}

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, bounds])
  return null
}

function MapLegend() {
  return (
    <Stack
      direction="row"
      role="list"
      aria-label="Map legend"
      sx={{ flexWrap: 'wrap', gap: 0.75 }}
    >
      {(Object.keys(STOP_COLORS) as RouteStop['type'][]).map((type) => (
        <Chip
          key={type}
          role="listitem"
          size="small"
          label={STOP_LABELS[type]}
          variant="outlined"
          sx={{
            borderColor: STOP_COLORS[type],
            color: STOP_COLORS[type],
            fontWeight: 600,
            fontSize: '0.6875rem',
            height: 22,
            bgcolor: 'background.paper',
          }}
        />
      ))}
    </Stack>
  )
}

export default function MapView({ routeData, loading = false, embedded = false }: MapViewProps) {
  const geometry = routeData?.geometry ?? []
  const stops = routeData?.stops ?? []
  const hasRoute = geometry.length > 0

  const bounds: LatLngBoundsExpression | null = hasRoute
    ? (geometry as LatLngBoundsExpression)
    : null

  const mapHeight = embedded
    ? { xs: 360, sm: 420, md: 520 }
    : { xs: 320, sm: 400, md: 480 }

  return (
    <Box
      component="section"
      aria-label="Route map"
      sx={{
        overflow: 'hidden',
        ...(embedded
          ? { bgcolor: 'background.paper' }
          : {
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }),
      }}
    >
      {!embedded && (
        <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" component="h2" id="map-heading" sx={{ fontWeight: 600 }}>
            Route map
          </Typography>
          <Typography variant="body2" color="text.secondary" aria-live="polite" sx={{ mt: 0.25 }}>
            {loading
              ? 'Calculating route…'
              : hasRoute
                ? `${routeData?.summary.total_distance_miles} mi · ${routeData?.summary.total_trip_hrs} hrs total`
                : 'Plan a trip to see the route, stops, and rest breaks.'}
          </Typography>
          {hasRoute && <Box sx={{ mt: 1.5 }}><MapLegend /></Box>}
        </Box>
      )}

      <Box sx={{ height: mapHeight, position: 'relative' }}>
        {loading && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ position: 'absolute', inset: 0, zIndex: 1, height: '100%' }}
            aria-hidden
          />
        )}

        {!loading && !hasRoute && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
              color: 'text.secondary',
              gap: 1,
              p: 3,
              textAlign: 'center',
            }}
          >
            <MapOutlinedIcon sx={{ fontSize: 48, opacity: 0.35 }} aria-hidden />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Route preview
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Submit trip details to render the map
            </Typography>
          </Box>
        )}

        <MapContainer
          center={
            hasRoute
              ? (geometry[Math.floor(geometry.length / 2)] as LatLngExpression)
              : US_CENTER
          }
          zoom={hasRoute ? 6 : DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
          aria-labelledby={embedded ? undefined : 'map-heading'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bounds && <FitBounds bounds={bounds} />}
          {hasRoute && (
            <Polyline
              positions={geometry as LatLngExpression[]}
              color={tokens.map.route}
              weight={4}
              opacity={0.9}
            />
          )}
          {stops.map((stop, index) => (
            <CircleMarker
              key={`${stop.type}-${stop.lat}-${stop.lng}-${index}`}
              center={[stop.lat, stop.lng]}
              radius={
                stop.type === 'current' || stop.type === 'pickup' || stop.type === 'dropoff' ? 9 : 7
              }
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: STOP_COLORS[stop.type],
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <strong>{stop.label}</strong>
                <br />
                Mile {stop.cumulative_miles}
                {stop.duration_hrs > 0 && (
                  <>
                    <br />
                    Stop: {stop.duration_hrs} hr{stop.duration_hrs !== 1 ? 's' : ''}
                  </>
                )}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </Box>

      {embedded && hasRoute && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
          <MapLegend />
        </Box>
      )}
    </Box>
  )
}
