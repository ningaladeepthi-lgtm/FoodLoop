import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import FoodSafetyProtocolPage from './pages/FoodSafetyProtocolPage';
import ImpactPage from './pages/ImpactPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboards
import DonorDashboard from './pages/DonorDashboard';
import CreateDonation from './pages/CreateDonation';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import CreateRequest from './pages/CreateRequest';
import AdminDashboard from './pages/AdminDashboard';
import FoodSafety from './pages/FoodSafety';

// Protection
import ProtectedRoutes from './routes/ProtectedRoutes';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/food-safety" element={<FoodSafetyProtocolPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Donor Routes */}
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoutes allowedRoles={['DONOR']}>
                    <DonorDashboard />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/donor/create-donation"
                element={
                  <ProtectedRoutes allowedRoles={['DONOR']}>
                    <CreateDonation />
                  </ProtectedRoutes>
                }
              />
              <Route path="/donor/my-donations" element={<Navigate to="/donor/dashboard" replace />} />
              <Route path="/donor/tracking" element={<Navigate to="/donor/dashboard" replace />} />

              {/* Volunteer Routes */}
              <Route
                path="/volunteer/dashboard"
                element={
                  <ProtectedRoutes allowedRoles={['VOLUNTEER']}>
                    <VolunteerDashboard />
                  </ProtectedRoutes>
                }
              />
              <Route path="/volunteer/available" element={<Navigate to="/volunteer/dashboard" replace />} />
              <Route path="/volunteer/my-pickups" element={<Navigate to="/volunteer/dashboard" replace />} />
              <Route path="/volunteer/live-tracking" element={<Navigate to="/volunteer/dashboard" replace />} />

              {/* Organization Routes */}
              <Route
                path="/org/dashboard"
                element={
                  <ProtectedRoutes allowedRoles={['ORGANIZATION']}>
                    <OrganizationDashboard />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/org/create-request"
                element={
                  <ProtectedRoutes allowedRoles={['ORGANIZATION']}>
                    <CreateRequest />
                  </ProtectedRoutes>
                }
              />
              <Route path="/org/my-requests" element={<Navigate to="/org/dashboard" replace />} />
              <Route path="/org/matching" element={<Navigate to="/org/dashboard" replace />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/food-safety"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <FoodSafety />
                  </ProtectedRoutes>
                }
              />
              <Route path="/admin/users" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/donations" element={<Navigate to="/admin/food-safety" replace />} />
              <Route path="/admin/reports" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
