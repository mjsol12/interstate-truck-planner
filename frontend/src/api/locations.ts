import client from './client'
import type { LocationSuggestion } from '../types/location'

export async function searchLocations(
  query: string,
  limit = 5,
): Promise<LocationSuggestion[]> {
  const response = await client.get<LocationSuggestion[]>('/locations/search/', {
    params: { q: query, limit },
  })
  return response.data
}
