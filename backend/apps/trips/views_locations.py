from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services.geocoder import GeocodingError, reverse_geocode, search_locations


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


@api_view(["GET"])
def location_reverse(request):
    try:
        lat = float(request.query_params.get("lat", ""))
        lng = float(request.query_params.get("lng", ""))
    except ValueError:
        return Response(
            {"detail": "Valid lat and lng query parameters are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        return Response(
            {"detail": "lat and lng must be valid coordinates."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        location = reverse_geocode(lat, lng)
    except GeocodingError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"label": location.label, "lat": location.lat, "lng": location.lng})