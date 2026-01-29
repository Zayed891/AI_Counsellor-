import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { UserProvider } from '@/context/UserContext'
import ProtectedRoute from '@/components/ProtectedRoute'
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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shortlist"
              element={
                <ProtectedRoute>
                  <Shortlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor"
              element={
                <ProtectedRoute>
                  <Counselor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guidance"
              element={
                <ProtectedRoute>
                  <Guidance />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
