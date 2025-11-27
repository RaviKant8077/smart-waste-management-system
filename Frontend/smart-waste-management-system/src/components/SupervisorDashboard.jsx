import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const SupervisorDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, complaintsResponse, routesResponse] = await Promise.all([
        apiClient.get('/supervisor/stats'),
        apiClient.get('/supervisor/complaints/recent'),
        apiClient.get('/supervisor/routes/active')
      ]);
      setStats(statsResponse.data);
      setRecentComplaints(complaintsResponse.data);
      setActiveRoutes(routesResponse.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintStatusUpdate = async (complaintId, status) => {
    try {
      await apiClient.put(`/supervisor/complaints/${complaintId}/status`, { status });
      fetchDashboardData();
    } catch (err) {
      setError('Failed to update complaint status');
      console.error('Error updating complaint status:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Supervisor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Total Complaints</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalComplaints || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Pending Complaints</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingComplaints || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Active Routes</h3>
          <p className="text-2xl font-bold text-green-600">{stats.activeRoutes || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Completed Collections</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.completedCollections || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Complaints</h2>
          <div className="space-y-3">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{complaint.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                <p className="text-xs text-gray-500">Reported: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                {complaint.status === 'PENDING' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleComplaintStatusUpdate(complaint.id, 'IN_PROGRESS')}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded"
                    >
                      Start Work
                    </button>
                    <button
                      onClick={() => handleComplaintStatusUpdate(complaint.id, 'RESOLVED')}
                      className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Active Routes</h2>
          <div className="space-y-3">
            {activeRoutes.map((route) => (
              <div key={route.id} className="border rounded p-3">
                <h4 className="font-medium">{route.name}</h4>
                <p className="text-sm text-gray-600">Assigned to: {route.employeeName}</p>
                <p className="text-sm text-gray-600">Vehicle: {route.vehicleLicensePlate}</p>
                <p className="text-xs text-gray-500">Started: {new Date(route.startTime).toLocaleString()}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${route.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{route.progress}% Complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
