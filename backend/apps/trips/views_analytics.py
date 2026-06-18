from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services.analytics import get_trip_analytics


@api_view(["GET"])
def trip_analytics(request):
    return Response(get_trip_analytics())
