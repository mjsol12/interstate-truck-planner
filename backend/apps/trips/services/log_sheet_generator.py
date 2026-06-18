"""Generate FMCSA daily log sheet data from planned route."""

from datetime import datetime, timedelta


STATUS_MAP = {
    "fuel": "on_duty",
    "pickup": "on_duty",
    "dropoff": "on_duty",
    "break": "off_duty",
    "rest": "off_duty",
}


def generate_log_sheets(route_data: dict, trip_start: datetime | None = None) -> list[dict]:
    """Build daily log sheets from route stops and leg summaries."""
    stops = route_data.get("stops", [])
    summary = route_data.get("summary", {})
    locations = route_data.get("locations", {})

    if not stops or not summary.get("total_driving_hrs"):
        return []

    trip_start = trip_start or datetime.now().replace(hour=6, minute=0, second=0, microsecond=0)
    avg_mph = summary["total_distance_miles"] / summary["total_driving_hrs"]
    timeline = _build_timeline(stops, avg_mph)
    daily_segments = _split_timeline_by_day(timeline)

    sheets = []
    for day_index, segments in sorted(daily_segments.items()):
        log_date = trip_start + timedelta(days=day_index)
        sheets.append(
            {
                "day_number": day_index + 1,
                "date": log_date.strftime("%Y-%m-%d"),
                "date_display": log_date.strftime("%m/%d/%Y"),
                "segments": segments,
                "from_location": _location_for_day(day_index, locations, segments),
                "to_location": locations.get("dropoff", {}).get("name", ""),
                "total_miles": _miles_for_day(day_index, daily_segments, summary),
                "remarks": _remarks_for_day(segments),
            }
        )

    return sheets


def _build_timeline(stops: list[dict], avg_mph: float) -> list[dict]:
    timeline: list[dict] = []
    t = 0.0

    for i, stop in enumerate(stops):
        if i > 0:
            prev = stops[i - 1]
            mile_delta = stop["cumulative_miles"] - prev["cumulative_miles"]
            if mile_delta > 0.01 and avg_mph > 0:
                drive_hrs = mile_delta / avg_mph
                timeline.append(
                    {
                        "status": "driving",
                        "start_hr": t,
                        "duration_hr": round(drive_hrs, 3),
                        "label": "Driving",
                    }
                )
                t += drive_hrs

        if stop["type"] == "current":
            continue

        if stop["duration_hrs"] > 0:
            status = STATUS_MAP.get(stop["type"], "on_duty")
            timeline.append(
                {
                    "status": status,
                    "start_hr": t,
                    "duration_hr": stop["duration_hrs"],
                    "label": stop["label"],
                }
            )
            t += stop["duration_hrs"]

    return timeline


def _split_timeline_by_day(timeline: list[dict]) -> dict[int, list[dict]]:
    daily: dict[int, list[dict]] = {}

    for segment in timeline:
        start = segment["start_hr"]
        duration = segment["duration_hr"]
        end = start + duration
        cursor = start

        while cursor < end - 1e-9:
            day_index = int(cursor // 24)
            day_end = (day_index + 1) * 24
            seg_end = min(end, day_end)
            local_start = round(cursor - day_index * 24, 3)
            local_end = round(seg_end - day_index * 24, 3)

            daily.setdefault(day_index, []).append(
                {
                    "status": segment["status"],
                    "start": local_start,
                    "end": local_end,
                    "label": segment["label"],
                }
            )
            cursor = seg_end

    return daily


def _location_for_day(day_index: int, locations: dict, segments: list[dict]) -> str:
    if day_index == 0:
        return locations.get("current", {}).get("name", "")
    return locations.get("pickup", {}).get("name", "")


def _miles_for_day(day_index: int, daily_segments: dict, summary: dict) -> float:
    total_days = len(daily_segments) or 1
    total_miles = summary.get("total_distance_miles", 0)
    if day_index == total_days - 1:
        return round(total_miles / total_days, 1)
    return round(total_miles / total_days, 1)


def _remarks_for_day(segments: list[dict]) -> str:
    labels = [s["label"] for s in segments if s["status"] != "driving"]
    return "; ".join(labels) if labels else "En route"
