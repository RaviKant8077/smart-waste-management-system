import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiClient } from '../api/client';

const RouteMonitoring = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState({});

  useEffect(() => {
    fetchRoutes();
    // Set up WebSocket connection for real-time updates
    setupWebSocket();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/supervisor/routes/active');
      setRoutes(response.data);
    } catch (err) {
      setError('Failed to fetch routes');
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    // WebSocket connection for real-time tracking
    const ws = new WebSocket('ws://localhost:8082/ws/tracking');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealTimeUpdates(prev => ({
        ...prev,
        [data.routeId]: data
      }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  };

  const getRouteColor = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'blue';
      case 'COMPLETED': return 'green';
      case 'DELAYED': return 'red';
      default: return 'gray';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-900 dark:text-white">Loading...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Route Monitoring</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Live Route Map</h2>
            <div style={{ height: '500px' }}>
              <MapContainer center={[40.7128, -74.0060]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {routes.map((route) => (
                  <React.Fragment key={route.id}>
                    {route.waypoints && (
                      <Polyline
                        positions={route.waypoints.map(wp => [wp.lat, wp.lng])}
                        color={getRouteColor(route.status)}
                        weight={3}
                      />
                    )}
                    {realTimeUpdates[route.id] && (
                      <Marker position={[realTimeUpdates[route.id].lat, realTimeUpdates[route.id].lng]}>
                        <Popup>
                          <div>
                            <p><strong>{route.name}</strong></p>
                            <p>Employee: {route.employeeName}</p>
                            <p>Vehicle: {route.vehicleLicensePlate}</p>
                            <p>Status: {route.status}</p>
                            <p>Last Update: {new Date(realTimeUpdates[route.id].timestamp).toLocaleTimeString()}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Active Routes</h2>
          {routes.map((route) => (
            <div
              key={route.id}
              className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-colors ${
                selectedRoute?.id === route.id ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => setSelectedRoute(route)}
            >
              <h3 className="font-semibold mb-2">{route.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Employee: {route.employeeName}</p>
                <p>Vehicle: {route.vehicleLicensePlate}</p>
                <p>Status: <span className={`font-medium ${
                  route.status === 'IN_PROGRESS' ? 'text-blue-600' :
                  route.status === 'COMPLETED' ? 'text-green-600' :
                  route.status === 'DELAYED' ? 'text-red-600' :
                  'text-gray-600'
                }`}>{route.status}</span></p>
                <p>Progress: {route.progress}%</p>
                {realTimeUpdates[route.id] && (
                  <p className="text-xs text-gray-500">
                    Last seen: {new Date(realTimeUpdates[route.id].timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${route.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRoute && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Route Details: {selectedRoute.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee</label>
              <p className="text-sm">{selectedRoute.employeeName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle</label>
              <p className="text-sm">{selectedRoute.vehicleLicensePlate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <p className="text-sm">{new Date(selectedRoute.startTime).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated End</label>
              <p className="text-sm">{new Date(selectedRoute.estimatedEndTime).toLocaleString()}</p>
            </div>
          </div>

          {selectedRoute.waypoints && selectedRoute.waypoints.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Waypoints</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedRoute.waypoints.map((waypoint, index) => (
                  <div key={index} className="border rounded p-2 text-sm">
                    <p><strong>Stop {index + 1}:</strong> {waypoint.address}</p>
                    <p>Coordinates: {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}</p>
                    <p>Status: {waypoint.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteMonitoring;
