import type { ReactNode } from 'react'
import { Box } from '@mui/material'

interface PageToolbarProps {
  children: ReactNode
  actions?: ReactNode
}

/** Standard page header row — title block left, actions right. */
export default function PageToolbar({ children, actions }: PageToolbarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      {children}
      {actions && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, alignSelf: 'flex-start' }}>
          {actions}
        </Box>
      )}
    </Box>
  )
}
