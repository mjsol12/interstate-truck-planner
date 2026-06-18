import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { ThemeModeProvider } from './context/ThemeModeContext'
import { SidebarProvider } from './context/SidebarContext'
import AppLayout from './components/AppLayout'
import Analytics from './pages/Analytics'
import Home from './pages/Home'
import Planner from './pages/Planner'
import LogSheets from './pages/LogSheets'
import LogSheetDetail from './pages/LogSheetDetail'

function App() {
  return (
    <ThemeModeProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/trip-planner" element={<Navigate to="/planner" replace />} />
              <Route path="/logs" element={<LogSheets />} />
              <Route path="/logs/:tripId/:dayNumber" element={<LogSheetDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </ThemeModeProvider>
  )
}

export default App
