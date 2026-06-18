from django.urls import path

from .views import TripDetailView, TripListCreateView
from .views_analytics import trip_analytics

urlpatterns = [
    path("trips/analytics/", trip_analytics, name="trip-analytics"),
    path("trips/", TripListCreateView.as_view(), name="trip-list-create"),
    path("trips/<int:pk>/", TripDetailView.as_view(), name="trip-detail"),
]
