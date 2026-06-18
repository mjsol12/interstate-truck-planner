import { useCallback, useRef, useState } from 'react'
import { reverseGeocode, searchLocations } from '../api/locations'
import type { MapCoordinates } from '../types/location'

export function useLocationPinSync(initialPin: MapCoordinates) {
  const [pin, setPin] = useState<MapCoordinates>(initialPin)
  const [recenter, setRecenter] = useState(false)
  const skipGeocodeRef = useRef(false)

  const handleLocationChange = useCallback(
    (value: string, coords: MapCoordinates | undefined, updateForm: (value: string) => void) => {
      updateForm(value)
      if (coords) {
        setPin(coords)
        setRecenter(true)
      }
    },
    [],
  )

  const handleLocationBlur = useCallback(async (query: string) => {
    if (skipGeocodeRef.current) {
      skipGeocodeRef.current = false
      return
    }

    const trimmed = query.trim()
    if (trimmed.length < 2) return

    try {
      const results = await searchLocations(trimmed, 1)
      if (results[0]) {
        setPin({ lat: results[0].lat, lng: results[0].lng })
        setRecenter(true)
      }
    } catch {
      // Keep the draggable pin if geocoding fails.
    }
  }, [])

  const handlePinMove = useCallback(
    async (lat: number, lng: number, updateForm: (value: string) => void) => {
      setPin({ lat, lng })
      setRecenter(false)
      skipGeocodeRef.current = true

      try {
        const location = await reverseGeocode(lat, lng)
        updateForm(location.label)
      } catch {
        updateForm(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      }
    },
    [],
  )

  const clearRecenter = useCallback(() => setRecenter(false), [])

  return {
    pin,
    recenter,
    clearRecenter,
    handleLocationChange,
    handleLocationBlur,
    handlePinMove,
  }
}
