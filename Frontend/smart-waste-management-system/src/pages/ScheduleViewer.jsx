import React, { useState, useEffect } from 'react';
import { citizenAPI } from '../api/client';

const ScheduleViewer = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await citizenAPI.getSchedule(selectedDate);
      setSchedule(response.data);
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error('Error fetching schedule:', err);
      // Don't show error toast here as it's handled in the UI
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Collection Schedule</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        {schedule.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No collections scheduled for this date
          </div>
        ) : (
          schedule.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.area}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.address}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.wasteType === 'GENERAL' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                  item.wasteType === 'RECYCLABLE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  item.wasteType === 'ORGANIC' ? 'bg-brown-100 text-brown-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {item.wasteType}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Scheduled Time:</span>
                  <p className="text-gray-600 dark:text-gray-300">{formatTime(item.scheduledTime)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Vehicle:</span>
                  <p className="text-gray-600 dark:text-gray-300">{item.vehicleLicensePlate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                  <p className={`font-medium ${
                    item.status === 'SCHEDULED' ? 'text-blue-600 dark:text-blue-400' :
                    item.status === 'IN_PROGRESS' ? 'text-orange-600 dark:text-orange-400' :
                    item.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {item.status}
                  </p>
                </div>
              </div>

              {item.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">Notes:</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Schedule Legend</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
            <span className="text-gray-900 dark:text-white">General Waste</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
            <span className="text-gray-900 dark:text-white">Recyclable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
            <span className="text-gray-900 dark:text-white">Organic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded"></div>
            <span className="text-gray-900 dark:text-white">Hazardous</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewer;
