export interface TripRequest {
  current_location: string
  pickup_location: string
  dropoff_location: string
  current_cycle_used_hrs: number
}

export interface RouteLocation {
  name: string
  lat: number
  lng: number
}

export interface RouteStop {
  type: 'current' | 'pickup' | 'dropoff' | 'fuel' | 'rest' | 'break'
  lat: number
  lng: number
  label: string
  cumulative_miles: number
  duration_hrs: number
}

export interface RouteSummary {
  total_distance_miles: number
  total_driving_hrs: number
  total_on_duty_hrs: number
  total_trip_hrs: number
  cycle_hours_used: number
  remaining_cycle_hrs: number
  warnings: string[]
}

export interface RouteLeg {
  from: string
  to: string
  distance_miles: number
  duration_hrs: number
}

export interface LogSegment {
  status: 'off_duty' | 'sleeper' | 'driving' | 'on_duty'
  start: number
  end: number
  label: string
}

export interface LogSheet {
  day_number: number
  date: string
  date_display: string
  segments: LogSegment[]
  from_location: string
  to_location: string
  total_miles: number
  remarks: string
}

export interface RouteData {
  geometry: [number, number][]
  locations: {
    current: RouteLocation
    pickup: RouteLocation
    dropoff: RouteLocation
  }
  stops: RouteStop[]
  summary: RouteSummary
  legs: RouteLeg[]
  log_sheets?: LogSheet[]
}

export interface TripResponse {
  id: number
  current_location: string
  pickup_location: string
  dropoff_location: string
  current_cycle_used_hrs: number
  status: 'pending' | 'completed' | 'failed'
  route_data: RouteData | null
  total_distance_miles: number | null
  total_duration_hrs: number | null
  error_message: string
  message: string
  created_at: string
}

export interface HealthResponse {
  status: string
}
