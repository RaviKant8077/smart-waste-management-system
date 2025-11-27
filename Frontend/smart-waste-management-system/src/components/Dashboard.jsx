import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../api/client';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import RouteMapModal from './RouteMapModal';
import RouteCompletionModal from './RouteCompletionModal';
import AttendanceModal from './AttendanceModal';
import ComplaintStatus from '../pages/ComplaintStatus';
import ScheduleViewer from '../pages/ScheduleViewer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StatCard({ title, value, icon: Icon, trend, onClick }) {
  const { isDarkMode } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg shadow-lg p-6 flex items-center space-x-4 cursor-pointer ${
        isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      {Icon && (
        <div className={`p-3 rounded-full ${
          isDarkMode ? 'bg-primary-900' : 'bg-primary-100'
        }`}>
          <Icon className={`h-6 w-6 ${
            isDarkMode ? 'text-primary-400' : 'text-primary-600'
          }`} />
        </div>
      )}
      <div>
        <p className={`text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>{title}</p>
        <p className={`text-2xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>{value}</p>
        {trend && (
          <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [assignedEmployee, setAssignedEmployee] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [employeeRoutes, setEmployeeRoutes] = useState([]);
  const [pendingCollections, setPendingCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoutesTable, setShowRoutesTable] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [showRouteMapModal, setShowRouteMapModal] = useState(false);
  const [showRouteCompletionModal, setShowRouteCompletionModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const handleMarkComplete = async (routeId) => {
    setSelectedRouteId(routeId);
    setShowRouteCompletionModal(true);
  };

  const handleStatCardClick = (view) => {
    setCurrentView(view);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardAPI.getDashboardStats();
        const { stats, chartData: responseChartData, routes, complaints, employeePerformance, assignedEmployee, attendance, employeeRoutes, pendingCollections } = response.data;

        setStats(stats);
        setChartData({
          labels: responseChartData.labels,
          datasets: [
            {
              label: 'Waste Collected (tons)',
              data: responseChartData.values,
              fill: false,
              borderColor: 'rgb(34, 197, 94)',
              tension: 0.1,
            },
          ],
        });

        // Store additional data for new sections
        setRoutes(routes || []);
        setComplaints(complaints || []);
        setEmployeePerformance(employeePerformance || []);
        setAssignedEmployee(assignedEmployee || null);
        setAttendance(attendance || null);
        setEmployeeRoutes(employeeRoutes || []);
        setPendingCollections(pendingCollections || []);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        // Set fallback data
        setStats({
          totalCollections: 128,
          activeRoutes: 12,
          pendingComplaints: 7,
          employeePerformance: 85,
          collectionsChange: 5,
          complaintsChange: -10,
          performanceChange: 2
        });
        setRoutes([]);
        setComplaints([]);
        setEmployeePerformance([]);
        setAssignedEmployee(null);
        setAttendance(null);
        setEmployeeRoutes([]);
        setPendingCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (currentView === 'complaints') {
    return (
      <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Complaints</h1>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        <ComplaintStatus />
      </div>
    );
  }

  if (currentView === 'schedule') {
    return (
      <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Schedule</h1>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        <ScheduleViewer />
      </div>
    );
  }

  if (currentView === 'collection-status') {
    return (
      <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Collection Status</h1>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Current Collection Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Assigned Employee</span>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{assignedEmployee?.name || 'Not Assigned'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</span>
              <span className={`px-2 py-1 text-xs rounded-full ${assignedEmployee ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {assignedEmployee ? 'Active' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last Updated</span>
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Smart Waste Management Dashboard</h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {user?.role === 'CITIZEN' && (
          <>
            <StatCard
              title="My Complaints"
              value={complaints?.length || 0}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              onClick={() => handleStatCardClick('complaints')}
            />
            <StatCard
              title="Assigned Employee"
              value={assignedEmployee?.name || 'Not Assigned'}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              onClick={() => handleStatCardClick('schedule')}
            />
            <StatCard
              title="Collection Status"
              value={assignedEmployee ? 'Active' : 'Pending'}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
              onClick={() => handleStatCardClick('collection-status')}
            />
          </>
        )}
        {(user?.role === 'ADMIN' || user?.role === 'SUPERVISOR') && (
          <>
            <StatCard
              title="Total Collections"
              value={stats?.totalCollections}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
              trend={stats?.collectionsChange}
            />
            <StatCard
              title="Active Routes"
              value={stats?.activeRoutes}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              )}
            />
            <StatCard
              title="Pending Complaints"
              value={stats?.pendingComplaints}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              trend={stats?.complaintsChange}
            />
            <StatCard
              title="Employee Performance"
              value={`${stats?.employeePerformance}%`}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
              trend={stats?.performanceChange}
            />
          </>
        )}
        {user?.role === 'EMPLOYEE' && (
          <>
            <StatCard
              title="Complaints Against Me"
              value={stats?.complaintsAgainstMe || 0}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            />
            <StatCard
              title="Active Routes"
              value={stats?.activeRoutes}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              )}
            />
            <StatCard
              title="Pending Collections"
              value={pendingCollections?.length || 0}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
            />
            <StatCard
              title="Performance"
              value={`${stats?.employeePerformance}%`}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
              trend={stats?.performanceChange}
            />
            <StatCard
              title="Attendance"
              value={`${attendance?.daysPresent || 0}/${attendance?.workingDays || 0}`}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              onClick={() => setShowAttendanceModal(true)}
            />
          </>
        )}
      </motion.div>

      {user?.role !== 'CITIZEN' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-lg shadow-lg p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Waste Collection Trends</h2>
          {chartData && (
            <div className="h-96">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Routes Section */}
      {user?.role !== 'CITIZEN' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-lg shadow-lg p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Routes</h3>
            <button
              onClick={() => setShowRoutesTable(!showRoutesTable)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>{showRoutesTable ? 'Hide Routes' : 'Show Routes'}</span>
            </button>
          </div>
          {showRoutesTable && (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Route Name</th>
                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Assigned Employee</th>
                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Collected Today</th>
                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-600' : 'bg-white divide-gray-200'} divide-y`}>
                  {(user?.role === 'EMPLOYEE'
                    ? routes.filter(route =>
                        route.assignedEmployee &&
                        (route.assignedEmployee === user.name ||
                         route.assignedEmployee === user.username ||
                         route.assignedEmployee === user.id)
                      )
                    : routes
                  ).map((route) => (
                    <tr key={route.id}>
                      <td className={`px-4 py-2 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{route.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          route.status === 'ACTIVE' ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
                        }`}>
                          {route.status}
                        </span>
                      </td>
                      <td className={`px-4 py-2 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{route.assignedEmployee || 'Unassigned'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          route.collectedToday ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
                        }`}>
                          {route.collectedToday ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedRouteId(route.id);
                            setShowRouteMapModal(true);
                          }}
                          className={`mr-2 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                        >
                          View on Map
                        </button>
                        {!route.collectedToday && (
                          <button
                            onClick={() => handleMarkComplete(route.id)}
                            className={`${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'}`}
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Complaints and Reports Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className={`rounded-lg shadow-lg p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>My Complaints</h3>
          <div className="space-y-4">
            {complaints.length > 0 ? (
              complaints.slice(0, 5).map((complaint) => (
                <div key={complaint.id} className={`border rounded-lg p-4 ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className={`text-base font-semibold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{complaint.title || 'Untitled Complaint'}</h4>
                      <p className={`text-sm mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{complaint.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {(complaint.createdAt || complaint.createdDate) && (
                          <span>Submitted: {(() => {
                            try {
                              const dateValue = complaint.createdAt || complaint.createdDate;
                              let date;

                              if (typeof dateValue === 'number') {
                                // Handle timestamp in milliseconds or seconds
                                date = new Date(dateValue > 1e12 ? dateValue : dateValue * 1000);
                              } else if (typeof dateValue === 'string') {
                                // Handle ISO string or other formats
                                if (dateValue.includes('T') || dateValue.includes('-')) {
                                  date = new Date(dateValue);
                                } else if (!isNaN(parseInt(dateValue))) {
                                  // Try parsing as timestamp string (milliseconds or seconds)
                                  const timestamp = parseInt(dateValue);
                                  date = new Date(timestamp > 1e12 ? timestamp : timestamp * 1000);
                                } else {
                                  date = new Date(dateValue);
                                }
                              } else {
                                date = new Date(dateValue);
                              }

                              return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                            } catch (e) {
                              return 'Invalid Date';
                            }
                          })()}</span>
                        )}
                        {complaint.priority && (
                          <span className={
                            complaint.priority === 'HIGH' ? 'text-red-600' :
                            complaint.priority === 'MEDIUM' ? 'text-orange-600' :
                            'text-green-600'
                          }>
                            Priority: {complaint.priority}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      {complaint.location && (
                        <span className={`${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>📍 {complaint.location}</span>
                      )}
                      {complaint.assignedEmployee && (
                        <span className={`${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>👤 {complaint.assignedEmployee.username || complaint.assignedEmployee.name}</span>
                      )}
                    </div>
                    {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Updated: {new Date(complaint.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {complaint.images && complaint.images.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {complaint.images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Complaint ${index + 1}`}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ))}
                      {complaint.images.length > 3 && (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                          +{complaint.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className={`text-lg font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>No complaints found</h3>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>You haven't submitted any complaints yet.</p>
              </div>
            )}
          </div>
        </div>

        {user?.role !== 'CITIZEN' && (
          <div className={`rounded-lg shadow-lg p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Employee Performance</h3>
            <div className="space-y-3">
              {employeePerformance.length > 0 ? (
                employeePerformance.slice(0, 5).map((perf) => (
                  <div key={`${perf.employeeName}-${perf.month}-${perf.year}`} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{perf.employeeName}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        perf.performanceLevel === 'DIAMOND' ? 'bg-purple-100 text-purple-800' :
                        perf.performanceLevel === 'PLATINUM' ? 'bg-blue-100 text-blue-800' :
                        perf.performanceLevel === 'GOLD' ? 'bg-yellow-100 text-yellow-800' :
                        perf.performanceLevel === 'SILVER' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {perf.performanceLevel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Score: {perf.score} | {perf.month}/{perf.year}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No performance data available.</p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions and System Status */}
      {user?.role !== 'CITIZEN' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className={`rounded-lg shadow-lg p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/reports')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Generate Collection Report</span>
              </button>
              <button
                onClick={() => navigate('/admin/routes')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Manage Routes</span>
              </button>
              <button
                onClick={() => navigate('/supervisor/complaints')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <span>View Active Complaints</span>
              </button>
            </div>
          </div>

          <div className={`rounded-lg shadow-lg p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Server Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-800">Just now</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Employees</span>
                <span className="text-gray-800">{stats?.activeRoutes || 0} online</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Route Map Modal */}
      <RouteMapModal
        routeId={selectedRouteId}
        isOpen={showRouteMapModal}
        onClose={() => setShowRouteMapModal(false)}
      />

      {/* Route Completion Modal */}
      <RouteCompletionModal
        routeId={selectedRouteId}
        isOpen={showRouteCompletionModal}
        onClose={() => setShowRouteCompletionModal(false)}
        onComplete={() => {
          setShowRouteCompletionModal(false);
          // Refresh the routes data
          const response = dashboardAPI.getDashboardStats();
          setRoutes(response.data.routes || []);
        }}
      />
    </div>
  );
}
