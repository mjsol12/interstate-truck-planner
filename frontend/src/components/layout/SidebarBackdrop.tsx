import { Box } from '@mui/material'
import { useSidebar } from '../../context/SidebarContext'

export default function SidebarBackdrop() {
  const { isMobileOpen, closeMobileSidebar } = useSidebar()

  if (!isMobileOpen) return null

  return (
    <Box
      onClick={closeMobileSidebar}
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        bgcolor: 'rgba(16, 24, 40, 0.5)',
        display: { lg: 'none' },
      }}
    />
  )
}
