import { createContext, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import RouteManagement from './components/RouteManagement';
import VehicleManagement from './components/VehicleManagement';
import ReportsDashboard from './components/ReportsDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import ComplaintManagement from './components/ComplaintManagement';
import RouteMonitoring from './components/RouteMonitoring';
import LoginPage from './pages/LoginPage';
import EmployeeRoute from './pages/EmployeeRoute';
import ScheduleViewer from './pages/ScheduleViewer';
import ComplaintStatus from './pages/ComplaintStatus';
import Complaint from './pages/Complaint';
import FeedbackForm from './pages/FeedbackForm';
import About from './components/About';
import Contact from './components/Contact';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Create auth context (keeping for backward compatibility, but using AuthProvider)
export const AuthContext = createContext(null);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/about" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      // Public Routes (visible to all users)
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      // Admin Routes
      {
        path: 'admin/dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'admin/users',
        element: <UserManagement />
      },
      {
        path: 'admin/routes',
        element: <RouteManagement />
      },
      {
        path: 'admin/vehicles',
        element: <VehicleManagement />
      },
      {
        path: 'admin/reports',
        element: <ReportsDashboard />
      },
      // Supervisor Routes
      {
        path: 'supervisor/dashboard',
        element: <SupervisorDashboard />
      },
      {
        path: 'supervisor/complaints',
        element: <ComplaintManagement />
      },
      {
        path: 'supervisor/routes',
        element: <RouteMonitoring />
      },
      // Employee Routes
      {
        path: 'employee/dashboard',
        element: <Dashboard />
      },
      {
        path: 'employee/route',
        element: <EmployeeRoute />
      },
      // Citizen Routes
      {
        path: 'citizen/dashboard',
        element: <Dashboard />
      },
      {
        path: 'citizen/schedule',
        element: <ScheduleViewer />
      },
      {
        path: 'citizen/complaints',
        element: <ComplaintStatus />
      },
      {
        path: 'citizen/feedback',
        element: <FeedbackForm />
      },
      {
        path: 'complaint',
        element: <Complaint />
      },
      // Add more routes here as we implement them
    ]
  }
]);

function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#22c55e',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
