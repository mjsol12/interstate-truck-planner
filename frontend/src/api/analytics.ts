import client from './client'
import type { TripAnalytics } from '../types/analytics'

export async function getTripAnalytics(): Promise<TripAnalytics> {
  const response = await client.get<TripAnalytics>('/trips/analytics/')
  return response.data
}
