"""Geocoding via OpenStreetMap Nominatim."""

import time
from dataclasses import dataclass

import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse"
USER_AGENT = "ELDTripPlanner/1.0"
_last_request_at = 0.0


@dataclass
class GeocodedLocation:
    name: str
    lat: float
    lng: float


@dataclass
class LocationSuggestion:
    label: str
    lat: float
    lng: float


class GeocodingError(Exception):
    pass


def _rate_limit():
    global _last_request_at
    elapsed = time.time() - _last_request_at
    if elapsed < 1.0:
        time.sleep(1.0 - elapsed)
    _last_request_at = time.time()


def search_locations(query: str, limit: int = 5) -> list[LocationSuggestion]:
    query = query.strip()
    if len(query) < 2:
        return []

    _rate_limit()
    response = requests.get(
        NOMINATIM_URL,
        params={
            "q": query,
            "format": "json",
            "limit": limit,
            "countrycodes": "us",
            "addressdetails": 0,
        },
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )
    response.raise_for_status()
    results = response.json()
    return [
        LocationSuggestion(
            label=result.get("display_name", query),
            lat=float(result["lat"]),
            lng=float(result["lon"]),
        )
        for result in results
    ]


def reverse_geocode(lat: float, lng: float) -> LocationSuggestion:
    _rate_limit()
    response = requests.get(
        NOMINATIM_REVERSE_URL,
        params={"lat": lat, "lon": lng, "format": "json", "countrycodes": "us"},
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )
    response.raise_for_status()
    result = response.json()
    if not result or result.get("error"):
        raise GeocodingError("Could not resolve coordinates to an address.")
    return LocationSuggestion(
        label=result.get("display_name", f"{lat}, {lng}"),
        lat=float(result.get("lat", lat)),
        lng=float(result.get("lon", lng)),
    )


def geocode_address(address: str) -> GeocodedLocation:
    _rate_limit()
    response = requests.get(
        NOMINATIM_URL,
        params={"q": address, "format": "json", "limit": 1, "countrycodes": "us"},
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )
    response.raise_for_status()
    results = response.json()
    if not results:
        raise GeocodingError(f"Could not find location: {address}")
    result = results[0]
    return GeocodedLocation(
        name=result.get("display_name", address),
        lat=float(result["lat"]),
        lng=float(result["lon"]),
    )
