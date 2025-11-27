import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { employeeAPI } from '../api/client';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AttendanceModal = ({ isOpen, onClose }) => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isOpen) {
      fetchTodayAttendance();
    }
  }, [isOpen]);

  const fetchTodayAttendance = async () => {
    try {
      const response = await employeeAPI.getTodayAttendance();
      setTodayAttendance(response.data);
    } catch (error) {
      toast.error('Failed to fetch attendance data');
    }
  };

  const markAttendance = async (status, remarks = '') => {
    setLoading(true);
    try {
      await employeeAPI.markAttendance(status, remarks);
      toast.success(`Attendance marked as ${status.toLowerCase()}`);
      await fetchTodayAttendance();
    } catch (error) {
      toast.error('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`rounded-lg shadow-xl max-w-md w-full mx-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Mark Attendance
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="p-6">
          {todayAttendance?.marked ? (
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                todayAttendance.status === 'PRESENT'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {todayAttendance.status === 'PRESENT' ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Attendance {todayAttendance.status === 'PRESENT' ? 'Marked' : 'Marked as Absent'}
              </h3>
              {todayAttendance.checkInTime && (
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Check-in: {new Date(todayAttendance.checkInTime).toLocaleTimeString()}
                </p>
              )}
              {todayAttendance.remarks && (
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Remarks: {todayAttendance.remarks}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please mark your attendance for today
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => markAttendance('PRESENT')}
                  disabled={loading}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Marking...' : 'Present'}
                </button>
                <button
                  onClick={() => markAttendance('ABSENT')}
                  disabled={loading}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Marking...' : 'Absent'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AttendanceModal;
