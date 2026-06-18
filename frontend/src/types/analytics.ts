export interface AnalyticsOverview {
  total_trips: number
  completed_trips: number
  failed_trips: number
  pending_trips: number
  success_rate: number
  total_miles: number
  avg_distance_miles: number
  avg_duration_hrs: number
  avg_cycle_used_hrs: number
  avg_cycle_hours_after_trip: number
  total_log_sheets: number
}

export interface StatusBreakdown {
  status: string
  label: string
  count: number
}

export interface DailyTripCount {
  date: string
  label: string
  count: number
}

export interface StopTotals {
  fuel: number
  rest: number
  break: number
}

export interface DistanceLeader {
  id: number
  pickup_location: string
  dropoff_location: string
  total_distance_miles: number | null
  total_duration_hrs: number | null
}

export interface RecentTripSummary {
  id: number
  pickup_location: string
  dropoff_location: string
  status: string
  total_distance_miles: number | null
  total_duration_hrs: number | null
  created_at: string
}

export interface TripAnalytics {
  overview: AnalyticsOverview
  trips_by_status: StatusBreakdown[]
  trips_by_day: DailyTripCount[]
  stop_totals: StopTotals
  distance_leaders: DistanceLeader[]
  recent_trips: RecentTripSummary[]
}
