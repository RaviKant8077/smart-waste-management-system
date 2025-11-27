import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { adminAPI } from '../api/client';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const ReportsDashboard = () => {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  const [totalWasteCollected, setTotalWasteCollected] = useState(0);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [resolvedComplaints, setResolvedComplaints] = useState(0);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getReports();
      setReports(response.data);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const collectionData = {
    labels: reports.collectionData?.map(item => item.date) || [],
    datasets: [{
      label: 'Collections',
      data: reports.collectionData?.map(item => item.count) || [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  const complaintData = {
    labels: reports.complaintData?.map(item => item.status) || [],
    datasets: [{
      data: reports.complaintData?.map(item => item.count) || [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  };

  const performanceData = {
    labels: reports.performanceData?.map(item => item.employee) || [],
    datasets: [{
      label: 'Performance Score',
      data: reports.performanceData?.map(item => item.score) || [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }]
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reports Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`rounded-lg shadow-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Collection Trends</h2>
          <Bar data={collectionData} />
        </div>

        <div className={`rounded-lg shadow-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Complaint Status</h2>
          <Pie data={complaintData} />
        </div>
      </div>

      <div className={`rounded-lg shadow-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Employee Performance</h2>
        <Line data={performanceData} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-lg shadow-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Total Collections</h3>
          <p className="text-2xl font-bold text-blue-600">{reports.reports?.totalWasteCollected || 0}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Total Complaints</h3>
          <p className="text-2xl font-bold text-red-600">{reports.reports?.totalComplaints || 0}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Resolved Complaints</h3>
          <p className="text-2xl font-bold text-green-600">{reports.reports?.resolvedComplaints || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
