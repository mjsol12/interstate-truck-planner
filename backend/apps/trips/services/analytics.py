from collections import Counter
from datetime import timedelta

from django.db.models import Avg, Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone

from ..models import Trip


def get_trip_analytics() -> dict:
    now = timezone.now()
    fourteen_days_ago = now - timedelta(days=13)

    qs = Trip.objects.all()
    completed = qs.filter(status=Trip.STATUS_COMPLETED)
    failed = qs.filter(status=Trip.STATUS_FAILED)
    pending = qs.filter(status=Trip.STATUS_PENDING)

    totals = completed.aggregate(
        total_miles=Sum("total_distance_miles"),
        avg_miles=Avg("total_distance_miles"),
        avg_duration=Avg("total_duration_hrs"),
    )

    avg_cycle = qs.aggregate(avg_cycle=Avg("current_cycle_used_hrs"))["avg_cycle"] or 0
    total_trips = qs.count()
    completed_count = completed.count()
    success_rate = round((completed_count / total_trips * 100), 1) if total_trips else 0

    trips_by_status = [
        {"status": Trip.STATUS_COMPLETED, "label": "Completed", "count": completed_count},
        {"status": Trip.STATUS_FAILED, "label": "Failed", "count": failed.count()},
        {"status": Trip.STATUS_PENDING, "label": "Pending", "count": pending.count()},
    ]

    daily_counts = {
        row["day"].isoformat(): row["count"]
        for row in qs.filter(created_at__date__gte=fourteen_days_ago.date())
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    }

    trips_by_day = []
    for i in range(14):
        day = (fourteen_days_ago + timedelta(days=i)).date()
        trips_by_day.append({
            "date": day.isoformat(),
            "label": day.strftime("%b %d"),
            "count": daily_counts.get(day.isoformat(), 0),
        })

    stop_counter: Counter[str] = Counter()
    total_log_sheets = 0
    total_cycle_hours_used = 0.0
    cycle_samples = 0

    for trip in completed.only("route_data", "total_distance_miles", "pickup_location", "dropoff_location", "id"):
        route_data = trip.route_data or {}
        for stop in route_data.get("stops", []):
            stop_type = stop.get("type")
            if stop_type in ("fuel", "rest", "break"):
                stop_counter[stop_type] += 1
        total_log_sheets += len(route_data.get("log_sheets", []))
        summary = route_data.get("summary", {})
        if "cycle_hours_used" in summary:
            total_cycle_hours_used += summary["cycle_hours_used"]
            cycle_samples += 1

    distance_leaders = [
        {
            "id": t.id,
            "pickup_location": t.pickup_location,
            "dropoff_location": t.dropoff_location,
            "total_distance_miles": t.total_distance_miles,
            "total_duration_hrs": t.total_duration_hrs,
        }
        for t in completed.filter(total_distance_miles__isnull=False).order_by("-total_distance_miles")[:5]
    ]

    recent_trips = [
        {
            "id": t.id,
            "pickup_location": t.pickup_location,
            "dropoff_location": t.dropoff_location,
            "status": t.status,
            "total_distance_miles": t.total_distance_miles,
            "total_duration_hrs": t.total_duration_hrs,
            "created_at": t.created_at.isoformat(),
        }
        for t in qs.order_by("-created_at")[:8]
    ]

    return {
        "overview": {
            "total_trips": total_trips,
            "completed_trips": completed_count,
            "failed_trips": failed.count(),
            "pending_trips": pending.count(),
            "success_rate": success_rate,
            "total_miles": round(totals["total_miles"] or 0, 1),
            "avg_distance_miles": round(totals["avg_miles"] or 0, 1),
            "avg_duration_hrs": round(totals["avg_duration"] or 0, 1),
            "avg_cycle_used_hrs": round(avg_cycle, 1),
            "avg_cycle_hours_after_trip": round(total_cycle_hours_used / cycle_samples, 1) if cycle_samples else 0,
            "total_log_sheets": total_log_sheets,
        },
        "trips_by_status": trips_by_status,
        "trips_by_day": trips_by_day,
        "stop_totals": {
            "fuel": stop_counter["fuel"],
            "rest": stop_counter["rest"],
            "break": stop_counter["break"],
        },
        "distance_leaders": distance_leaders,
        "recent_trips": recent_trips,
    }
