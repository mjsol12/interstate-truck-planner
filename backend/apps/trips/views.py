from rest_framework import generics, status
from rest_framework.response import Response

from .models import Trip
from .serializers import TripCreateSerializer, TripResponseSerializer
from .services.route_planner import TripPlanningError, plan_route


class TripListCreateView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TripCreateSerializer
        return TripResponseSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trip = serializer.save(status=Trip.STATUS_PENDING)

        try:
            route_data = plan_route(
                trip.current_location,
                trip.pickup_location,
                trip.dropoff_location,
                trip.current_cycle_used_hrs,
            )
            trip.route_data = route_data
            trip.total_distance_miles = route_data["summary"]["total_distance_miles"]
            trip.total_duration_hrs = route_data["summary"]["total_trip_hrs"]
            trip.status = Trip.STATUS_COMPLETED
            trip.save()
        except TripPlanningError as exc:
            trip.status = Trip.STATUS_FAILED
            trip.error_message = str(exc)
            trip.save()
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_serializer = TripResponseSerializer(trip)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class TripDetailView(generics.RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripResponseSerializer
