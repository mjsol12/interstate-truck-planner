"""
Route planning service.

Future responsibilities:
- Geocode location strings to coordinates
- Fetch driving routes from OSRM public API
- Plan fuel stops every 1,000 miles
- Plan rest stops per HOS rules
- Return route geometry and stop metadata for map rendering
"""


def plan_route(current_location, pickup_location, dropoff_location):
    """Placeholder for OSRM-based route planning."""
    raise NotImplementedError("Route planning not yet implemented")
