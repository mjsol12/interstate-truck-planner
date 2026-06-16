import client from './client'
import type { TripRequest, TripResponse } from '../types/trip'

export async function createTrip(data: TripRequest): Promise<TripResponse> {
  const response = await client.post<TripResponse>('/trips/', data)
  return response.data
}

export async function getTrip(id: number): Promise<TripResponse> {
  const response = await client.get<TripResponse>(`/trips/${id}/`)
  return response.data
}

export async function listTrips(): Promise<TripResponse[]> {
  const response = await client.get<TripResponse[]>('/trips/')
  return response.data
}
