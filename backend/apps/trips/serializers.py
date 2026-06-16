from rest_framework import serializers

from .models import Trip


class TripCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            "current_location",
            "pickup_location",
            "dropoff_location",
            "current_cycle_used_hrs",
        ]

    def validate_current_cycle_used_hrs(self, value):
        if value < 0:
            raise serializers.ValidationError("Current cycle used hours cannot be negative.")
        if value > 70:
            raise serializers.ValidationError("Current cycle used hours cannot exceed 70.")
        return value


class TripResponseSerializer(serializers.ModelSerializer):
    message = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            "id",
            "current_location",
            "pickup_location",
            "dropoff_location",
            "current_cycle_used_hrs",
            "status",
            "message",
            "created_at",
        ]

    def get_message(self, obj):
        if obj.status == Trip.STATUS_PENDING:
            return "Route calculation not yet implemented"
        return "Trip processed"
