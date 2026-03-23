import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Incidents from './pages/Incidents'
import IncidentForm from './pages/IncidentForm'
import IncidentDetail from './pages/IncidentDetail'
import Maintenance from './pages/Maintenance'
import MaintenanceForm from './pages/MaintenanceForm'
import MaintenanceDetail from './pages/MaintenanceDetail'
import UserManagement from './pages/UserManagement'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/incidents" element={<Incidents />} />
                  <Route path="/incidents/new" element={<IncidentForm />} />
                  <Route path="/incidents/:id" element={<IncidentDetail />} />
                  <Route path="/incidents/:id/edit" element={<IncidentForm />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/maintenance/new" element={<MaintenanceForm />} />
                  <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
                  <Route path="/maintenance/:id/edit" element={<MaintenanceForm />} />
                  <Route
                    path="/users"
                    element={
                      <AdminRoute>
                        <UserManagement />
                      </AdminRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
