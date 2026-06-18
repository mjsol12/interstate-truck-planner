import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Marker, useMap } from 'react-leaflet'
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import type { RouteData, RouteStop } from '../types/trip'
import type { MapCoordinates } from '../types/location'
import { plannerPinIcons, type PlannerPinType } from './map/plannerPinIcon'
import { PLANNER_STOP_LABELS } from '../constants/plannerStops'
import { tokens } from '../theme/tokens'
import 'leaflet/dist/leaflet.css'

const US_CENTER: LatLngExpression = [39.8283, -98.5795]
const DEFAULT_ZOOM = 4
const PLANNER_PIN_ZOOM = 8

const STOP_COLORS = tokens.map.stops as Record<RouteStop['type'], string>

const STOP_LABELS: Record<RouteStop['type'], string> = {
  current: 'Current',
  pickup: 'Pickup',
  dropoff: 'Dropoff',
  fuel: 'Fuel',
  rest: 'Rest',
  break: 'Break',
}

interface PlannerPinProps {
  id: PlannerPinType
  label: string
  position: MapCoordinates
  draggable?: boolean
  onMove?: (lat: number, lng: number) => void
  recenter?: boolean
  onRecenterComplete?: () => void
}

interface MapViewProps {
  routeData?: RouteData | null
  loading?: boolean
  /** Render inside a Panel — hides duplicate chrome/header. */
  embedded?: boolean
  /** Show interactive map with draggable location pins before route exists. */
  planningMode?: boolean
  plannerPins?: PlannerPinProps[]
}

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, bounds])
  return null
}

function FlyToPlannerPin({
  position,
  active,
  onComplete,
}: {
  position: LatLngExpression
  active: boolean
  onComplete?: () => void
}) {
  const map = useMap()

  useEffect(() => {
    if (!active) return
    map.flyTo(position, Math.max(map.getZoom(), PLANNER_PIN_ZOOM), { duration: 0.8 })
    onComplete?.()
  }, [active, map, onComplete, position])

  return null
}

function DraggablePlannerPin({
  id,
  label,
  position,
  draggable = true,
  onMove,
}: PlannerPinProps) {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={plannerPinIcons[id]}
      draggable={draggable}
      eventHandlers={{
        dragend: (event) => {
          const { lat, lng } = event.target.getLatLng()
          onMove?.(lat, lng)
        },
      }}
    >
      <Popup>
        <strong>{label}</strong>
        <br />
        Drag to adjust
      </Popup>
    </Marker>
  )
}

function PlanningLegend() {
  const types: PlannerPinType[] = ['current', 'pickup', 'dropoff']

  return (
    <Stack
      direction="row"
      role="list"
      aria-label="Planning map legend"
      sx={{ flexWrap: 'wrap', gap: 0.75 }}
    >
      {types.map((type) => (
        <Chip
          key={type}
          role="listitem"
          size="small"
          label={PLANNER_STOP_LABELS[type]}
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

export default function MapView({
  routeData,
  loading = false,
  embedded = false,
  planningMode = false,
  plannerPins = [],
}: MapViewProps) {
  const geometry = routeData?.geometry ?? []
  const stops = routeData?.stops ?? []
  const hasRoute = geometry.length > 0
  const showPlannerPins = planningMode && !hasRoute && plannerPins.length > 0

  const bounds: LatLngBoundsExpression | null = hasRoute
    ? (geometry as LatLngBoundsExpression)
    : null

  const primaryPlannerPin = plannerPins[0]
  const mapCenter: LatLngExpression = hasRoute
    ? (geometry[Math.floor(geometry.length / 2)] as LatLngExpression)
    : primaryPlannerPin
      ? ([primaryPlannerPin.position.lat, primaryPlannerPin.position.lng] as LatLngExpression)
      : US_CENTER

  const mapZoom = hasRoute ? 6 : showPlannerPins ? DEFAULT_ZOOM : DEFAULT_ZOOM

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

        {!loading && !hasRoute && !showPlannerPins && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.elevated',
              color: 'text.secondary',
              gap: 1,
              p: 3,
              textAlign: 'center',
              pointerEvents: 'none',
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

        {showPlannerPins && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              boxShadow: 1,
              pointerEvents: 'none',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Drag pins or enter locations in the form
            </Typography>
          </Box>
        )}

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
          aria-labelledby={embedded ? undefined : 'map-heading'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bounds && <FitBounds bounds={bounds} />}
          {showPlannerPins &&
            plannerPins.map((pin) => (
              <DraggablePlannerPin key={pin.id} {...pin} />
            ))}
          {showPlannerPins &&
            plannerPins.map((pin) =>
              pin.recenter ? (
                <FlyToPlannerPin
                  key={`fly-${pin.id}`}
                  position={[pin.position.lat, pin.position.lng]}
                  active={pin.recenter}
                  onComplete={pin.onRecenterComplete}
                />
              ) : null,
            )}
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

      {embedded && showPlannerPins && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.elevated' }}>
          <PlanningLegend />
        </Box>
      )}

      {embedded && hasRoute && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.elevated' }}>
          <MapLegend />
        </Box>
      )}
    </Box>
  )
}
