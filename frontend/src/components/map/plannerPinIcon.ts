import L from 'leaflet'
import { tokens } from '../../theme/tokens'

export type PlannerPinType = 'current' | 'pickup' | 'dropoff'

function createPlannerPinIcon(color: string) {
  return L.divIcon({
    className: 'planner-pin',
    html: `<div style="
      width: 20px;
      height: 20px;
      background: ${color};
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

export const plannerPinIcons: Record<PlannerPinType, L.DivIcon> = {
  current: createPlannerPinIcon(tokens.map.stops.current),
  pickup: createPlannerPinIcon(tokens.map.stops.pickup),
  dropoff: createPlannerPinIcon(tokens.map.stops.dropoff),
}

/** @deprecated Use plannerPinIcons.current */
export const plannerCurrentPinIcon = plannerPinIcons.current
