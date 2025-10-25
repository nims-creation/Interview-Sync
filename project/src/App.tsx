import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import InterviewerDashboard from './pages/interviewer/InterviewerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookingPage from './pages/candidate/BookingPage';
import ManageSlotsPage from './pages/interviewer/ManageSlotsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              {/* Candidate Routes */}
              <Route path="candidate" element={<ProtectedRoute allowedRoles={['candidate']} />}>
                <Route path="dashboard" element={<CandidateDashboard />} />
                <Route path="book" element={<BookingPage />} />
              </Route>
              
              {/* Interviewer Routes */}
              <Route path="interviewer" element={<ProtectedRoute allowedRoles={['interviewer']} />}>
                <Route path="dashboard" element={<InterviewerDashboard />} />
                <Route path="slots" element={<ManageSlotsPage />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>
              
              {/* Shared Routes */}
              <Route path="profile" element={<ProtectedRoute allowedRoles={['candidate', 'interviewer', 'admin']} />}>
                <Route index element={<ProfilePage />} />
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;