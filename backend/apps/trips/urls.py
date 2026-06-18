from django.urls import path

from .views import TripDetailView, TripListCreateView
from .views_analytics import trip_analytics
from .views_locations import location_search

urlpatterns = [
    path("locations/search/", location_search, name="location-search"),
    path("trips/analytics/", trip_analytics, name="trip-analytics"),
    path("trips/", TripListCreateView.as_view(), name="trip-list-create"),
    path("trips/<int:pk>/", TripDetailView.as_view(), name="trip-detail"),
]
