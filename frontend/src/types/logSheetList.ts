import type { LogSheet, TripResponse } from './trip'

export interface LogSheetListRow {
  tripId: number
  pickupLocation: string
  dropoffLocation: string
  sheet: LogSheet
}

export interface LogSheetListFilters {
  search: string
  tripId: number | 'all'
}

export function flattenLogSheets(trips: TripResponse[]): LogSheetListRow[] {
  const rows: LogSheetListRow[] = []
  for (const trip of trips) {
    const sheets = trip.route_data?.log_sheets ?? []
    for (const sheet of sheets) {
      rows.push({
        tripId: trip.id,
        pickupLocation: trip.pickup_location,
        dropoffLocation: trip.dropoff_location,
        sheet,
      })
    }
  }
  return rows.sort((a, b) => {
    if (a.tripId !== b.tripId) return b.tripId - a.tripId
    return a.sheet.day_number - b.sheet.day_number
  })
}

export function filterLogSheetRows(
  rows: LogSheetListRow[],
  filters: LogSheetListFilters,
): LogSheetListRow[] {
  const q = filters.search.trim().toLowerCase()
  return rows.filter((row) => {
    if (filters.tripId !== 'all' && row.tripId !== filters.tripId) return false
    if (!q) return true
    const haystack = [
      String(row.tripId),
      row.pickupLocation,
      row.dropoffLocation,
      row.sheet.date_display,
      row.sheet.from_location,
      row.sheet.to_location,
      row.sheet.remarks,
      `day ${row.sheet.day_number}`,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}
