import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import { apiClient, employeeAPI } from '../api/client'
import { isOnline, cacheOfflineForm, syncOfflineForms, addOnlineOfflineListeners } from '../utils/pwa'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
})

export default function EmployeeRoute() {
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [position, setPosition] = useState(null)
  const [collections, setCollections] = useState([])
  const [selectedWaypoint, setSelectedWaypoint] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(!isOnline())
  const watchId = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await apiClient.get('/api/employee/routes/today')
        setRoutes(res.data)
        if (res.data.length > 0) {
          setSelectedRoute(res.data[0])
          // Load existing collections for today
          const collectionsRes = await employeeAPI.getTodayCollections()
          setCollections(collectionsRes.data)
        }
      } catch (e) {
        setError('Failed to load route data')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Listen for online/offline status
    const cleanup = addOnlineOfflineListeners(
      () => {
        setIsOffline(false)
        syncOfflineForms() // Sync any cached forms
      },
      () => setIsOffline(true)
    )

    return cleanup
  }, [])

  function startTracking() {
    if (!navigator.geolocation) return alert('Geolocation not available')
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
        // Send location update to backend
        apiClient.post('/employee/location', {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }).catch(console.error)
      },
      console.error,
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 },
    )
  }

  function stopTracking() {
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current)
    watchId.current = null
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPhoto(file)
    }
  }

  const submitCollection = async (waypointId) => {
    if (!photo) {
      alert('Please take a photo before submitting')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('photo', photo)
      formData.append('waypointId', waypointId)
      formData.append('timestamp', new Date().toISOString())

      // Check if offline - cache for later if so
      const wasCached = await cacheOfflineForm(formData, '/employee/collections')
      if (wasCached) {
        alert('You are offline. Collection will be submitted when connection is restored.')
        // Still update local state for UI feedback
        setCollections(prev => [...prev, {
          waypointId,
          timestamp: new Date().toISOString(),
          status: 'pending_sync'
        }])
        setPhoto(null)
        setSelectedWaypoint(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      await apiClient.post('/employee/collections', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Refresh collections
      const collectionsRes = await employeeAPI.getTodayCollections()
      setCollections(collectionsRes.data)
      setPhoto(null)
      setSelectedWaypoint(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError('Failed to submit collection')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const waypoints = selectedRoute?.waypoints || []
  const poly = waypoints.map((w) => [w.lat, w.lng])

  const getWaypointStatus = (waypointId) => {
    const collection = collections.find(c => c.waypointId === waypointId)
    if (!collection) return 'pending'
    if (collection.status === 'pending_sync') return 'pending_sync'
    return 'completed'
  }

  if (loading && routes.length === 0) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Today's Routes</h1>
        {isOffline && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
            You are currently offline. Some features may be limited.
          </div>
        )}
      </div>

      {routes.length > 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Select Route</h3>
          <div className="flex gap-2 flex-wrap">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`px-4 py-2 rounded ${
                  selectedRoute?.id === route.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {route.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button onClick={startTracking} className="px-3 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded">Start Tracking</button>
        <button onClick={stopTracking} className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">Stop Tracking</button>
        <div className="text-sm text-gray-600 flex items-center">
          Collections completed: {collections.filter(c => c.status !== 'pending_sync').length} / {waypoints.length}
          {collections.some(c => c.status === 'pending_sync') && (
            <span className="ml-2 text-yellow-600">
              ({collections.filter(c => c.status === 'pending_sync').length} pending sync)
            </span>
          )}
        </div>
      </div>

      {selectedWaypoint && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-3">Collection for {selectedWaypoint.address || `Waypoint ${selectedWaypoint.id}`}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Take Photo</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {photo && (
              <div className="mt-3">
                <img src={URL.createObjectURL(photo)} alt="Preview" className="w-32 h-32 object-cover rounded border" />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => submitCollection(selectedWaypoint.id)}
                disabled={!photo || loading}
                className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Collection'}
              </button>
              <button
                onClick={() => {
                  setSelectedWaypoint(null)
                  setPhoto(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-96 rounded overflow-hidden border border-gray-200">
        <MapContainer center={poly[0] || [20, 77]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {poly.length > 0 && <Polyline positions={poly} color="#4f46e5" />}
          {waypoints.map((w) => {
            const status = getWaypointStatus(w.id)
            return (
              <Marker key={w.id} position={[w.lat, w.lng]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold">{w.bin_id ? `Bin ${w.bin_id}` : 'Waypoint'}</p>
                    <p className="text-sm text-gray-600">{w.address}</p>
                    <p className={`text-xs font-medium ${
                      status === 'completed' ? 'text-green-600' :
                      status === 'pending_sync' ? 'text-yellow-600' :
                      'text-orange-600'
                    }`}>
                      {status === 'completed' ? '✓ Completed' :
                       status === 'pending_sync' ? '⏳ Pending Sync' :
                       'Pending'}
                    </p>
                    {status === 'pending' && (
                      <button
                        onClick={() => setSelectedWaypoint(w)}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Collect Here
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}
          {position && <Marker position={position}><Popup>You are here</Popup></Marker>}
        </MapContainer>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Route Progress</h3>
        <div className="space-y-2">
          {waypoints.map((w, index) => {
            const status = getWaypointStatus(w.id)
            return (
              <div key={w.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Stop {index + 1}</span>
                  <span className="text-sm text-gray-600">{w.address || `Bin ${w.bin_id}`}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  status === 'completed' ? 'bg-green-100 text-green-800' :
                  status === 'pending_sync' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {status === 'completed' ? 'Completed' :
                   status === 'pending_sync' ? 'Pending Sync' :
                   'Pending'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
