from rest_framework import generics, status
from rest_framework.response import Response

from .models import Trip
from .serializers import TripCreateSerializer, TripResponseSerializer


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
        response_serializer = TripResponseSerializer(trip)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class TripDetailView(generics.RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripResponseSerializer
