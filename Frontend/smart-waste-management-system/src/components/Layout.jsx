import { useState } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import Navigation from './Navigation';
import TopNavbar from './TopNavbar';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Define public routes that don't require authentication
  const publicRoutes = ['/about', '/contact', '/login'];

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">Loading...</div>;
  }

  // If user is not authenticated and trying to access protected routes
  if (!user && !publicRoutes.includes(location.pathname)) {
    // Store the current location the user was trying to access
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // For public routes, show simple layout without navigation
  if (!user && publicRoutes.includes(location.pathname)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Smart Waste Management</h1>
              </div>
              <nav className="flex space-x-4">
                <Link
                  to="/about"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/about'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/contact'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/login'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Login
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
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
    );
  }

  // For authenticated users, show full layout with top navbar and sidebar navigation
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="sticky top-0 z-50">
        <TopNavbar />
      </div>
      <div className="flex">
        <div className="sticky top-0 h-screen">
          <Navigation />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
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
  );
};

export default Layout;
