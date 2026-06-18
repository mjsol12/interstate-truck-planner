import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  CircularProgress,
  TextField,
  type TextFieldProps,
} from '@mui/material'
import { searchLocations } from '../api/locations'
import LocationColorIndicator from './LocationColorIndicator'
import type { LocationSuggestion } from '../types/location'

interface LocationAutocompleteProps {
  label: string
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: LocationSuggestion) => void
  onBlur?: (value: string) => void
  indicatorColor?: string
  disabled?: boolean
  placeholder?: string
  required?: boolean
  name?: string
  textFieldProps?: Partial<TextFieldProps>
}

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 350

export default function LocationAutocomplete({
  label,
  value,
  onChange,
  onSelect,
  onBlur,
  indicatorColor,
  disabled = false,
  placeholder,
  required = false,
  name,
  textFieldProps,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [options, setOptions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const query = inputValue.trim()
    if (query.length < MIN_QUERY_LENGTH) {
      setOptions([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    const timer = window.setTimeout(async () => {
      try {
        const results = await searchLocations(query)
        if (!cancelled) {
          setOptions(results)
        }
      } catch {
        if (!cancelled) {
          setOptions([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [inputValue])

  const selectedOption = useMemo(
    () => options.find((option) => option.label === value) ?? null,
    [options, value],
  )

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={selectedOption}
      inputValue={inputValue}
      loading={loading}
      disabled={disabled}
      filterOptions={(items) => items}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.label
      }
      isOptionEqualToValue={(option, selected) =>
        typeof option === 'string' || typeof selected === 'string'
          ? option === selected
          : option.label === selected.label
      }
      noOptionsText={
        inputValue.trim().length < MIN_QUERY_LENGTH
          ? 'Type at least 2 characters'
          : 'No locations found'
      }
      onInputChange={(_event, nextInputValue, reason) => {
        setInputValue(nextInputValue)
        if (reason === 'input' || reason === 'clear') {
          onChange(nextInputValue)
        }
      }}
      onChange={(_event, nextValue) => {
        if (typeof nextValue === 'string') {
          onChange(nextValue)
          return
        }
        if (nextValue) {
          onChange(nextValue.label)
          onSelect?.(nextValue)
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          label={label}
          name={name}
          required={required}
          placeholder={placeholder}
          size="small"
          fullWidth
          onBlur={(event) => {
            textFieldProps?.onBlur?.(event)
            onBlur?.(value)
          }}
          slotProps={{
            ...params.slotProps,
            ...textFieldProps?.slotProps,
            htmlInput: {
              ...params.slotProps.htmlInput,
              ...textFieldProps?.slotProps?.htmlInput,
              autoComplete: 'off',
            },
            input: {
              ...params.slotProps.input,
              ...textFieldProps?.slotProps?.input,
              startAdornment: (
                <>
                  {indicatorColor ? <LocationColorIndicator color={indicatorColor} /> : null}
                  {params.slotProps.input.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={18} aria-hidden />
                  ) : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  )
}
