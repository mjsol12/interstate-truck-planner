export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    })
  })
}

export function getGeolocationErrorMessage(error: unknown): string {
  if (error instanceof GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission denied. Enter your location manually.'
      case error.POSITION_UNAVAILABLE:
        return 'Unable to determine your location. Enter it manually.'
      case error.TIMEOUT:
        return 'Location request timed out. Try again or enter manually.'
      default:
        return 'Could not get your location. Enter it manually.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Could not get your location. Enter it manually.'
}
