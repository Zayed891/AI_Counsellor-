import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { UserProvider } from '@/context/UserContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Discover from '@/pages/Discover'
import Shortlist from '@/pages/Shortlist'
import Counselor from '@/pages/Counselor'
import Guidance from '@/pages/Guidance'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            {/* Protected Routes with Dashboard Layout */}
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/shortlist" element={<Shortlist />} />
              <Route path="/counselor" element={<Counselor />} />
              <Route path="/guidance" element={<Guidance />} />
            </Route>
          </Routes>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
