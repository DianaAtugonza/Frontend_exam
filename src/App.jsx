import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import HomeNew from './pages/HomeNew';
import ExploreNew from './pages/ExploreNew';
import LoginNew from './pages/LoginNew';
import RegisterNew from './pages/RegisterNew';

import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardRouter from './pages/DashboardRouter';
import StudentDashboard from './pages/StudentDashboardNew';
import SupervisorDashboard from './pages/SupervisorDashboardNew';
import FacultyAdminDashboard from './pages/FacultyAdminDashboardNew';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import ProjectDetails from './components/Projects/ProjectDetails';
import ProjectSubmissionForm from './components/Projects/ProjectSubmissionForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomeNew />} />
            <Route path="explore" element={<ExploreNew />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="login" element={<LoginNew />} />
            <Route path="register" element={<RegisterNew />} />
          </Route>

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardRouter />} />
            <Route 
              path="student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="supervisor" 
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <SupervisorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin" 
              element={
                <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                  <FacultyAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="submit" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProjectSubmissionForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
