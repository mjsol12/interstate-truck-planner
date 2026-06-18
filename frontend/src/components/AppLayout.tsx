import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import AppSidebar from './layout/AppSidebar'
import AppHeader from './layout/AppHeader'
import SidebarBackdrop from './layout/SidebarBackdrop'
import { useSidebar } from '../context/SidebarContext'
import { tokens } from '../theme/tokens'

export default function AppLayout() {
  const { isExpanded, isMobileOpen } = useSidebar()

  const sidebarOpen = isExpanded || isMobileOpen
  const mainMargin = {
    xs: 0,
    lg: sidebarOpen ? `${tokens.layout.sidebarExpanded}px` : `${tokens.layout.sidebarCollapsed}px`,
  }

  return (
    // h-screen equivalent: lock shell to viewport so inner pages control their own scroll
    <Box sx={{ height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AppSidebar />
      <SidebarBackdrop />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          ml: mainMargin,
          overflow: 'hidden',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <AppHeader />
        <Box
          component="main"
          id="main-content"
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3, md: 4 },
            maxWidth: 1536,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
