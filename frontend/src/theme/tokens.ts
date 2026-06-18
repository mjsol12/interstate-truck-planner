/** Design tokens aligned with SurePay / TailAdmin palette */
export const tokens = {
  spacing: {
    unit: 8,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  layout: {
    sidebarExpanded: 290,
    sidebarCollapsed: 90,
    headerHeight: 72,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  colors: {
    brand: {
      500: '#465fff',
      600: '#3641f5',
    },
    sidebar: '#07133f',
    sidebarDark: '#040d28',
    /** Sidebar nav — icon and label share the same color for WCAG contrast on navy. */
    sidebarNav: {
      textActive: '#ffffff',
      textInactive: 'rgba(255, 255, 255, 0.82)',
      textHover: '#ffffff',
      itemBgActive: 'rgba(70, 95, 255, 0.28)',
      itemBgHover: 'rgba(255, 255, 255, 0.08)',
      itemBgActiveHover: 'rgba(70, 95, 255, 0.36)',
      focusRing: '#93a5ff',
    },
    primary: '#465fff',
    primaryDark: '#3641f5',
    primaryLight: '#ecf3ff',
    text: '#101828',
    textSecondary: '#667085',
    textMuted: '#98a2b3',
    border: '#e4e7ec',
    borderStrong: '#d0d5dd',
    surface: '#ffffff',
    background: '#f9fafb',
    backgroundSubtle: '#f2f4f7',
    success: '#12b76a',
    warning: '#f79009',
    error: '#f04438',
    focusRing: '#465fff',
    gray: {
      50: '#f9fafb',
      100: '#f2f4f7',
      200: '#e4e7ec',
      800: '#1d2939',
      900: '#101828',
      950: '#0c111d',
    },
  },
  dark: {
    text: '#f9fafb',
    textSecondary: '#98a2b3',
    border: '#1d2939',
    surface: '#101828',
    background: '#0c111d',
    header: '#101828',
  },
  typography: {
    fontFamily: '"Outfit", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shadow: {
    sm: '0 1px 2px rgba(16, 24, 40, 0.05)',
    md: '0 4px 12px rgba(16, 24, 40, 0.08)',
  },
  map: {
    route: '#465fff',
    stops: {
      current: '#12b76a',
      pickup: '#465fff',
      dropoff: '#f04438',
      fuel: '#f79009',
      rest: '#7a5af8',
      break: '#eaaa08',
    },
  },
} as const

export type ColorMode = 'light' | 'dark'
