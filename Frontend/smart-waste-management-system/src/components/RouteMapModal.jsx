import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { employeeAPI } from '../api/client';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const RouteMapModal = ({ routeId, isOpen, onClose }) => {
  const [waypoints, setWaypoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && routeId) {
      fetchWaypoints();
    }
  }, [isOpen, routeId]);

  const fetchWaypoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getRouteWaypoints(routeId);
      setWaypoints(response.data);
    } catch (err) {
      setError('Failed to load route waypoints');
      console.error('Error fetching waypoints:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Calculate center of the route
  const getCenter = () => {
    if (waypoints.length === 0) return [20.5937, 78.9629]; // Default to India center

    const lats = waypoints.map(wp => wp.latitude);
    const lngs = waypoints.map(wp => wp.longitude);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return [centerLat, centerLng];
  };

  // Create polyline positions
  const polylinePositions = waypoints
    .sort((a, b) => a.sequence - b.sequence)
    .map(wp => [wp.latitude, wp.longitude]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Route Map</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {loading && (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div style={{ height: '500px' }}>
              <MapContainer
                center={getCenter()}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Draw the route polyline */}
                {polylinePositions.length > 1 && (
                  <Polyline
                    positions={polylinePositions}
                    color="#4f46e5"
                    weight={4}
                    opacity={0.8}
                  />
                )}

                {/* Add markers for each waypoint */}
                {waypoints.map((waypoint, index) => (
                  <Marker
                    key={waypoint.id}
                    position={[waypoint.latitude, waypoint.longitude]}
                  >
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold">Stop {waypoint.sequence}</p>
                        {waypoint.binId && <p className="text-sm">Bin ID: {waypoint.binId}</p>}
                        <p className="text-xs text-gray-600">
                          {waypoint.latitude.toFixed(6)}, {waypoint.longitude.toFixed(6)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {waypoints.length} waypoints in this route
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMapModal;
