export interface TripRequest {
  current_location: string
  pickup_location: string
  dropoff_location: string
  current_cycle_used_hrs: number
}

export interface TripResponse {
  id: number
  current_location: string
  pickup_location: string
  dropoff_location: string
  current_cycle_used_hrs: number
  status: 'pending' | 'completed'
  message: string
  created_at: string
}

export interface HealthResponse {
  status: string
}
