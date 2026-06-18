import { useState } from 'react'
import {
  Box,
  CircularProgress,
  FormHelperText,
  IconButton,
  Tooltip,
} from '@mui/material'
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined'
import axios from 'axios'
import { reverseGeocode } from '../api/locations'
import LocationAutocomplete from './LocationAutocomplete'
import {
  getCurrentPosition,
  getGeolocationErrorMessage,
} from '../utils/geolocation'

interface CurrentLocationFieldProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
}

export default function CurrentLocationField({
  value,
  onChange,
  disabled = false,
  required = false,
}: CurrentLocationFieldProps) {
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  const handleUseCurrentLocation = async () => {
    setGeoLoading(true)
    setGeoError(null)

    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      const location = await reverseGeocode(latitude, longitude)
      onChange(location.label)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        setGeoError(String(error.response.data.detail))
      } else {
        setGeoError(getGeolocationErrorMessage(error))
      }
    } finally {
      setGeoLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <LocationAutocomplete
            label="Current location"
            name="current_location"
            value={value}
            onChange={(nextValue) => {
              setGeoError(null)
              onChange(nextValue)
            }}
            required={required}
            placeholder="e.g. Chicago, IL"
            disabled={disabled || geoLoading}
          />
        </Box>
        <Tooltip title={geoLoading ? 'Locating…' : 'Use current device location'}>
          <span>
            <IconButton
              type="button"
              size="small"
              onClick={handleUseCurrentLocation}
              disabled={disabled || geoLoading}
              aria-label="Use current device location"
              sx={{
                flexShrink: 0,
                mt: 0.75,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              {geoLoading ? (
                <CircularProgress size={18} color="inherit" aria-hidden />
              ) : (
                <MyLocationOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      {geoError && (
        <FormHelperText error sx={{ mx: 1.75, mt: 0.5 }}>
          {geoError}
        </FormHelperText>
      )}
    </Box>
  )
}
