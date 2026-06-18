"""
Hours of Service (HOS) calculation for property-carrying drivers.

Rules applied (70/8, no adverse conditions):
- 11 hours max driving before 10 consecutive hours off duty
- 30-minute break required after 8 cumulative hours driving
- 1 hour on-duty (not driving) for pickup and dropoff
- Fuel stop at least every 1,000 miles
"""

from dataclasses import dataclass, field
import math

from .osrm_client import OsrmRoute

MAX_CYCLE_HOURS = 70
MAX_DRIVE_HOURS = 11
BREAK_AFTER_DRIVE_HOURS = 8
BREAK_DURATION_HOURS = 0.5
REST_DURATION_HOURS = 10
FUEL_INTERVAL_MILES = 1000
PICKUP_DROPOFF_HOURS = 1
METERS_TO_MILES = 0.000621371


@dataclass
class RouteStop:
    type: str
    lat: float
    lng: float
    label: str
    cumulative_miles: float
    duration_hrs: float = 0.0


@dataclass
class ScheduleResult:
    stops: list[RouteStop] = field(default_factory=list)
    total_driving_hrs: float = 0.0
    total_on_duty_hrs: float = 0.0
    total_trip_hrs: float = 0.0
    cycle_hours_used: float = 0.0
    warnings: list[str] = field(default_factory=list)


def _haversine_meters(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    radius = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lng2 - lng1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _interpolate(a: tuple[float, float], b: tuple[float, float], ratio: float) -> tuple[float, float]:
    return (a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio)


def _walk_leg(
    geometry: list[list[float]],
    leg_duration_seconds: float,
    cumulative_miles: float,
    miles_since_fuel: float,
    drive_since_rest: float,
    drive_since_break: float,
    stops: list[RouteStop],
    stop_counter: dict[str, int],
) -> tuple[float, float, float, float, float]:
    if len(geometry) < 2:
        return cumulative_miles, miles_since_fuel, drive_since_rest, drive_since_break, 0.0

    total_leg_meters = sum(
        _haversine_meters(geometry[i][0], geometry[i][1], geometry[i + 1][0], geometry[i + 1][1])
        for i in range(len(geometry) - 1)
    )
    total_leg_miles = total_leg_meters * METERS_TO_MILES
    total_leg_drive_hrs = leg_duration_seconds / 3600
    mph = total_leg_miles / total_leg_drive_hrs if total_leg_drive_hrs else 55

    for i in range(len(geometry) - 1):
        seg_start = geometry[i]
        seg_end = geometry[i + 1]
        seg_meters = _haversine_meters(seg_start[0], seg_start[1], seg_end[0], seg_end[1])
        seg_miles = seg_meters * METERS_TO_MILES
        seg_progress = 0.0

        while seg_progress < seg_miles - 1e-9:
            remaining_seg = seg_miles - seg_progress
            triggers: list[tuple[str, float, float]] = []

            miles_to_fuel = FUEL_INTERVAL_MILES - miles_since_fuel
            if miles_to_fuel <= remaining_seg:
                triggers.append(("fuel", miles_to_fuel, 0.5))

            if mph > 0:
                miles_to_break = (BREAK_AFTER_DRIVE_HOURS - drive_since_break) * mph
                if miles_to_break <= remaining_seg:
                    triggers.append(("break", miles_to_break, BREAK_DURATION_HOURS))

                miles_to_rest = (MAX_DRIVE_HOURS - drive_since_rest) * mph
                if miles_to_rest <= remaining_seg:
                    triggers.append(("rest", miles_to_rest, REST_DURATION_HOURS))

            if not triggers:
                drive_inc = remaining_seg / mph if mph else 0
                miles_since_fuel += remaining_seg
                drive_since_rest += drive_inc
                drive_since_break += drive_inc
                cumulative_miles += remaining_seg
                break

            triggers.sort(key=lambda item: item[1])
            stop_type, dist, duration = triggers[0]
            ratio = (seg_progress + dist) / seg_miles if seg_miles else 0
            lat, lng = _interpolate((seg_start[0], seg_start[1]), (seg_end[0], seg_end[1]), min(ratio, 1.0))

            stop_counter[stop_type] = stop_counter.get(stop_type, 0) + 1
            label_templates = {
                "fuel": "Fuel Stop",
                "break": "30-Min Break",
                "rest": "10-Hr Rest",
            }
            label = f"{label_templates[stop_type]} #{stop_counter[stop_type]}"
            drive_inc = dist / mph if mph else 0
            stops.append(
                RouteStop(
                    type=stop_type,
                    lat=lat,
                    lng=lng,
                    label=label,
                    cumulative_miles=round(cumulative_miles + dist, 1),
                    duration_hrs=duration,
                )
            )

            seg_progress += dist
            cumulative_miles += dist
            drive_since_rest += drive_inc
            drive_since_break += drive_inc

            if stop_type == "fuel":
                miles_since_fuel = 0
            elif stop_type == "break":
                drive_since_break = 0
            elif stop_type == "rest":
                drive_since_rest = 0
                drive_since_break = 0

    return cumulative_miles, miles_since_fuel, drive_since_rest, drive_since_break, total_leg_drive_hrs


def build_schedule(
    leg_routes: list[OsrmRoute],
    waypoint_stops: list[RouteStop],
    current_cycle_used_hrs: float,
) -> ScheduleResult:
    all_stops: list[RouteStop] = [waypoint_stops[0]]
    stop_counter: dict[str, int] = {}
    cumulative_miles = 0.0
    miles_since_fuel = 0.0
    drive_since_rest = 0.0
    drive_since_break = 0.0
    total_on_duty_hrs = 0.0
    total_driving_hrs = 0.0
    warnings: list[str] = []

    for leg_index, leg_route in enumerate(leg_routes):
        if leg_index > 0:
            wp = waypoint_stops[leg_index]
            all_stops.append(
                RouteStop(
                    type=wp.type,
                    lat=wp.lat,
                    lng=wp.lng,
                    label=f"{wp.label} (1 hr on-duty)",
                    cumulative_miles=round(cumulative_miles, 1),
                    duration_hrs=PICKUP_DROPOFF_HOURS,
                )
            )
            total_on_duty_hrs += PICKUP_DROPOFF_HOURS

        mid_stops: list[RouteStop] = []
        cumulative_miles, miles_since_fuel, drive_since_rest, drive_since_break, leg_drive_hrs = _walk_leg(
            leg_route.geometry,
            leg_route.total_duration_seconds,
            cumulative_miles,
            miles_since_fuel,
            drive_since_rest,
            drive_since_break,
            mid_stops,
            stop_counter,
        )
        all_stops.extend(mid_stops)
        total_driving_hrs += leg_drive_hrs

    final = waypoint_stops[-1]
    all_stops.append(
        RouteStop(
            type=final.type,
            lat=final.lat,
            lng=final.lng,
            label=f"{final.label} (1 hr on-duty)",
            cumulative_miles=round(cumulative_miles, 1),
            duration_hrs=PICKUP_DROPOFF_HOURS,
        )
    )
    total_on_duty_hrs += PICKUP_DROPOFF_HOURS

    total_off_duty_hrs = sum(s.duration_hrs for s in all_stops if s.type in ("rest", "break"))
    total_trip_hrs = total_driving_hrs + total_on_duty_hrs + total_off_duty_hrs
    cycle_hours_used = current_cycle_used_hrs + total_driving_hrs + total_on_duty_hrs

    if cycle_hours_used > MAX_CYCLE_HOURS:
        warnings.append(
            f"Trip exceeds 70-hour/8-day cycle by {cycle_hours_used - MAX_CYCLE_HOURS:.1f} hours."
        )

    return ScheduleResult(
        stops=all_stops,
        total_driving_hrs=round(total_driving_hrs, 2),
        total_on_duty_hrs=round(total_on_duty_hrs, 2),
        total_trip_hrs=round(total_trip_hrs, 2),
        cycle_hours_used=round(cycle_hours_used, 2),
        warnings=warnings,
    )
