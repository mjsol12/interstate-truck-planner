import { IconButton, InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  clearable?: boolean
  'aria-label'?: string
  size?: 'small' | 'medium'
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  clearable = true,
  'aria-label': ariaLabel = 'Search',
  size = 'small',
}: SearchInputProps) {
  const hasValue = value.trim().length > 0

  return (
    <TextField
      fullWidth
      size={size}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment:
            clearable && hasValue ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={() => onChange('')}
                  edge="end"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
        },
      }}
    />
  )
}
