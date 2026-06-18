"""Orchestrates geocoding, routing, and HOS-aware stop planning."""

from dataclasses import asdict

from .geocoder import GeocodedLocation, GeocodingError, geocode_address
from .hos_calculator import METERS_TO_MILES, RouteStop, build_schedule
from .log_sheet_generator import generate_log_sheets
from .osrm_client import OsrmRoute, RoutingError, fetch_route


class TripPlanningError(Exception):
    pass


def plan_route(current_location: str, pickup_location: str, dropoff_location: str, current_cycle_used_hrs: float) -> dict:
    try:
        current = geocode_address(current_location)
        pickup = geocode_address(pickup_location)
        dropoff = geocode_address(dropoff_location)
    except GeocodingError as exc:
        raise TripPlanningError(str(exc)) from exc

    try:
        leg_to_pickup = fetch_route([(current.lat, current.lng), (pickup.lat, pickup.lng)])
        leg_to_dropoff = fetch_route([(pickup.lat, pickup.lng), (dropoff.lat, dropoff.lng)])
    except RoutingError as exc:
        raise TripPlanningError(str(exc)) from exc
    except Exception as exc:
        raise TripPlanningError(f"Routing service error: {exc}") from exc

    geometry = leg_to_pickup.geometry + leg_to_dropoff.geometry[1:]
    combined = OsrmRoute(
        geometry=geometry,
        legs=[*leg_to_pickup.legs, *leg_to_dropoff.legs],
        total_distance_meters=leg_to_pickup.total_distance_meters + leg_to_dropoff.total_distance_meters,
        total_duration_seconds=leg_to_pickup.total_duration_seconds + leg_to_dropoff.total_duration_seconds,
    )

    waypoint_stops = [
        RouteStop("current", current.lat, current.lng, "Current Location", 0),
        RouteStop("pickup", pickup.lat, pickup.lng, "Pickup", 0),
        RouteStop("dropoff", dropoff.lat, dropoff.lng, "Dropoff", 0),
    ]

    leg_routes = [leg_to_pickup, leg_to_dropoff]
    schedule = build_schedule(leg_routes, waypoint_stops, current_cycle_used_hrs)
    total_distance_miles = round(combined.total_distance_meters * METERS_TO_MILES, 1)

    legs_summary = [
        {
            "from": label_from,
            "to": label_to,
            "distance_miles": round(leg.total_distance_meters * METERS_TO_MILES, 1),
            "duration_hrs": round(leg.total_duration_seconds / 3600, 2),
        }
        for (label_from, label_to), leg in zip(
            [("Current", "Pickup"), ("Pickup", "Dropoff")],
            leg_routes,
        )
    ]

    return {
        "geometry": combined.geometry,
        "locations": {
            "current": _location_dict(current),
            "pickup": _location_dict(pickup),
            "dropoff": _location_dict(dropoff),
        },
        "stops": [asdict(stop) for stop in schedule.stops],
        "summary": {
            "total_distance_miles": total_distance_miles,
            "total_driving_hrs": schedule.total_driving_hrs,
            "total_on_duty_hrs": schedule.total_on_duty_hrs,
            "total_trip_hrs": schedule.total_trip_hrs,
            "cycle_hours_used": schedule.cycle_hours_used,
            "remaining_cycle_hrs": round(70 - schedule.cycle_hours_used, 2),
            "warnings": schedule.warnings,
        },
        "legs": legs_summary,
        "log_sheets": generate_log_sheets(
            {
                "stops": [asdict(stop) for stop in schedule.stops],
                "summary": {
                    "total_distance_miles": total_distance_miles,
                    "total_driving_hrs": schedule.total_driving_hrs,
                },
                "locations": {
                    "current": _location_dict(current),
                    "pickup": _location_dict(pickup),
                    "dropoff": _location_dict(dropoff),
                },
            }
        ),
    }


def _location_dict(location: GeocodedLocation) -> dict:
    return {"name": location.name, "lat": location.lat, "lng": location.lng}
