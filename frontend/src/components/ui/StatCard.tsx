import { Box, Typography } from '@mui/material'

interface StatCardProps {
  label: string
  value: string
  unit?: string
}

export default function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: 'background.default',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="overline" color="text.secondary" component="dt">
        {label}
      </Typography>
      <Typography variant="h5" component="dd" sx={{ mt: 0.5, mb: 0 }}>
        {value}
        {unit && (
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            {unit}
          </Typography>
        )}
      </Typography>
    </Box>
  )
}
