import type { ElementType } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Box, Tooltip, Typography } from '@mui/material'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import { useSidebar } from '../../context/SidebarContext'
import { tokens } from '../../theme/tokens'

const nav = tokens.colors.sidebarNav

type NavItem = {
  label: string
  path: string
  Icon: ElementType<SvgIconProps>
}

const mainNav: NavItem[] = [
  { label: 'Home', path: '/', Icon: HomeOutlinedIcon },
  { label: 'Analytics', path: '/analytics', Icon: BarChartOutlinedIcon },
  { label: 'Planner', path: '/planner', Icon: RouteOutlinedIcon },
  { label: 'Log Sheets', path: '/logs', Icon: DescriptionOutlinedIcon },
]

function SidebarNavLink({
  item,
  active,
  showLabel,
}: {
  item: NavItem
  active: boolean
  showLabel: boolean
}) {
  const { Icon } = item
  const textColor = active ? nav.textActive : nav.textInactive

  const link = (
    <Box
      component={RouterLink}
      to={item.path}
      aria-current={active ? 'page' : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: showLabel ? 1.5 : 1,
        py: 1.25,
        borderRadius: 2,
        textDecoration: 'none',
        color: textColor,
        bgcolor: active ? nav.itemBgActive : 'transparent',
        justifyContent: showLabel ? 'flex-start' : 'center',
        transition: 'background-color 0.2s, color 0.2s',
        '&:hover': {
          bgcolor: active ? nav.itemBgActiveHover : nav.itemBgHover,
          color: nav.textHover,
        },
        '&:focus-visible': {
          outline: `2px solid ${nav.focusRing}`,
          outlineOffset: 2,
        },
        // Icon + label always share the same computed color
        '& .sidebar-nav-icon': {
          color: 'inherit',
        },
      }}
    >
      <Icon className="sidebar-nav-icon" sx={{ fontSize: 20 }} aria-hidden />
      {showLabel && (
        <Typography
          variant="body2"
          component="span"
          sx={{
            fontWeight: active ? 600 : 500,
            color: 'inherit',
          }}
        >
          {item.label}
        </Typography>
      )}
    </Box>
  )

  if (showLabel) return link

  return (
    <Tooltip title={item.label} placement="right" arrow describeChild>
      <Box component="span" sx={{ display: 'block' }}>
        {link}
      </Box>
    </Tooltip>
  )
}

export default function AppSidebar() {
  const location = useLocation()
  const { isExpanded, isMobileOpen } = useSidebar()

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const showLabels = isExpanded || isMobileOpen
  const isOpen = isExpanded || isMobileOpen
  const width = isOpen ? tokens.layout.sidebarExpanded : tokens.layout.sidebarCollapsed

  return (
    <Box
      component="aside"
      aria-label="Sidebar navigation"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        height: '100vh',
        width,
        display: 'flex',
        flexDirection: 'column',
        px: 2.5,
        bgcolor: tokens.colors.sidebar,
        borderRight: '1px solid rgba(255,255,255,0.08)',
        transition: 'width 0.3s ease, transform 0.3s ease',
        transform: {
          xs: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          lg: 'translateX(0)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: showLabels ? 'flex-start' : 'center',
          justifyContent: showLabels ? 'flex-start' : 'center',
          gap: 1.5,
          py: 4,
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: showLabels ? 'flex-start' : 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: 2,
            '&:focus-visible': {
              outline: `2px solid ${nav.focusRing}`,
              outlineOffset: 2,
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LocalShippingOutlinedIcon sx={{ color: nav.textActive, fontSize: 28 }} aria-hidden />
          </Box>
          {showLabels && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ color: nav.textActive, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}
              >
                ELD Trip Planner
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: nav.textInactive, display: 'block', mt: 0.5 }}
              >
                FMCSA route &amp; logs
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box component="nav" sx={{ flex: 1, overflowY: 'auto', pb: 3 }} aria-label="Main menu">
        <Typography
          variant="overline"
          component="p"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(255,255,255,0.55)',
            mb: 2,
            justifyContent: showLabels ? 'flex-start' : 'center',
          }}
        >
          {showLabels ? 'Menu' : <MoreHorizIcon sx={{ fontSize: 16, color: 'inherit' }} aria-hidden />}
        </Typography>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {mainNav.map((item) => (
            <Box component="li" key={item.path}>
              <SidebarNavLink item={item} active={isActive(item.path)} showLabel={showLabels} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
