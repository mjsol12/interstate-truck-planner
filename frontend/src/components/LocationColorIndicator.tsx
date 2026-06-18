import { Box, InputAdornment } from '@mui/material'

interface LocationColorIndicatorProps {
  color: string
}

export default function LocationColorIndicator({ color }: LocationColorIndicatorProps) {
  return (
    <InputAdornment position="start">
      <Box
        component="span"
        aria-hidden
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: color,
          border: '2px solid',
          borderColor: 'background.paper',
          boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider}`,
          flexShrink: 0,
          display: 'block',
        }}
      />
    </InputAdornment>
  )
}
