from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services.geocoder import search_locations


@api_view(["GET"])
def location_search(request):
    query = request.query_params.get("q", "").strip()
    if len(query) < 2:
        return Response([])

    try:
        limit = min(int(request.query_params.get("limit", 5)), 10)
    except ValueError:
        limit = 5

    suggestions = search_locations(query, limit=limit)
    return Response(
        [{"label": item.label, "lat": item.lat, "lng": item.lng} for item in suggestions]
    )
