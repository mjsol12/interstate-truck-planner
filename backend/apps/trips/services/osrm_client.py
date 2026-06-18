"""OSRM routing client."""

from dataclasses import dataclass

import requests

OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving"


@dataclass
class RouteLeg:
    distance_meters: float
    duration_seconds: float


@dataclass
class OsrmRoute:
    geometry: list[list[float]]
    legs: list[RouteLeg]
    total_distance_meters: float
    total_duration_seconds: float


class RoutingError(Exception):
    pass


def fetch_route(waypoints: list[tuple[float, float]]) -> OsrmRoute:
    """Fetch a driving route through ordered (lat, lng) waypoints."""
    if len(waypoints) < 2:
        raise RoutingError("At least two waypoints are required.")

    coords = ";".join(f"{lng},{lat}" for lat, lng in waypoints)
    url = f"{OSRM_BASE_URL}/{coords}"
    response = requests.get(
        url,
        params={"overview": "full", "geometries": "geojson", "steps": "false"},
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    if data.get("code") != "Ok" or not data.get("routes"):
        raise RoutingError(data.get("message", "Unable to calculate route."))

    route = data["routes"][0]
    geometry = [[coord[1], coord[0]] for coord in route["geometry"]["coordinates"]]
    legs = [
        RouteLeg(distance_meters=leg["distance"], duration_seconds=leg["duration"])
        for leg in route["legs"]
    ]
    return OsrmRoute(
        geometry=geometry,
        legs=legs,
        total_distance_meters=route["distance"],
        total_duration_seconds=route["duration"],
    )
