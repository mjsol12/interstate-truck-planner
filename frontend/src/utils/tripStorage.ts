const LAST_TRIP_KEY = 'eld_last_trip_id'

export function saveLastTripId(id: number) {
  sessionStorage.setItem(LAST_TRIP_KEY, String(id))
}

export function getLastTripId(): number | null {
  const saved = sessionStorage.getItem(LAST_TRIP_KEY)
  return saved ? Number(saved) : null
}
