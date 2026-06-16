"""
Hours of Service (HOS) calculation service.

Future responsibilities:
- Apply property-carrying driver rules (70 hrs / 8 days)
- Account for 1-hour pickup and 1-hour dropoff
- Calculate required rest periods and daily driving limits
- Generate daily log sheet data for multi-day trips
"""

MAX_CYCLE_HOURS = 70
MAX_CYCLE_DAYS = 8
PICKUP_DROPOFF_HOURS = 1


def calculate_hos_schedule(trip_duration_hrs, current_cycle_used_hrs):
    """Placeholder for HOS schedule calculation."""
    raise NotImplementedError("HOS calculation not yet implemented")
