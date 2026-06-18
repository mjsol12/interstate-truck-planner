import type { PlannerPinType } from '../components/map/plannerPinIcon'
import { tokens } from '../theme/tokens'

export const PLANNER_STOP_LABELS: Record<PlannerPinType, string> = {
  current: 'Current',
  pickup: 'Pickup',
  dropoff: 'Dropoff',
}

export const PLANNER_STOP_COLORS: Record<PlannerPinType, string> = {
  current: tokens.map.stops.current,
  pickup: tokens.map.stops.pickup,
  dropoff: tokens.map.stops.dropoff,
}
