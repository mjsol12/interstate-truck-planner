import type { LogSheet, TripResponse } from './trip'

export interface LogSheetListRow {
  tripId: number
  pickupLocation: string
  dropoffLocation: string
  sheet: LogSheet
  /** Lowercased text built once for client-side search. */
  searchText: string
}

export interface LogSheetListFilters {
  search: string
}

function buildSearchText(row: Omit<LogSheetListRow, 'searchText'>): string {
  const { sheet } = row
  return [
    String(row.tripId),
    row.pickupLocation,
    row.dropoffLocation,
    String(sheet.day_number),
    sheet.date,
    sheet.date_display,
    sheet.from_location,
    sheet.to_location,
    String(sheet.total_miles),
    sheet.remarks,
    ...sheet.segments.flatMap((segment) => [
      segment.status,
      segment.label,
      String(segment.start),
      String(segment.end),
    ]),
  ]
    .join(' ')
    .toLowerCase()
}

export function flattenLogSheets(trips: TripResponse[]): LogSheetListRow[] {
  const rows: LogSheetListRow[] = []
  for (const trip of trips) {
    const sheets = trip.route_data?.log_sheets ?? []
    for (const sheet of sheets) {
      const base = {
        tripId: trip.id,
        pickupLocation: trip.pickup_location,
        dropoffLocation: trip.dropoff_location,
        sheet,
      }
      rows.push({ ...base, searchText: buildSearchText(base) })
    }
  }
  return rows.sort((a, b) => {
    if (a.tripId !== b.tripId) return b.tripId - a.tripId
    return a.sheet.day_number - b.sheet.day_number
  })
}

export function filterLogSheetRows(
  rows: LogSheetListRow[],
  search: string,
): LogSheetListRow[] {
  const q = search.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) => row.searchText.includes(q))
}
