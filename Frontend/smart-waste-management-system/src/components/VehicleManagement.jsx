import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/client';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    registrationNo: '',
    type: '',
    capacityKg: '',
    ward: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getVehicles();
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createVehicle(formData);
      setShowForm(false);
      setFormData({ registrationNo: '', type: '', capacityKg: '', ward: '', status: 'AVAILABLE' });
      fetchVehicles();
    } catch (err) {
      setError('Failed to create vehicle');
      console.error('Error creating vehicle:', err);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await adminAPI.deleteVehicle(vehicleId);
        fetchVehicles();
      } catch (err) {
        setError('Failed to delete vehicle');
        console.error('Error deleting vehicle:', err);
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-900 dark:text-white">Loading...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400 text-center">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Vehicle
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border border-gray-300 dark:border-gray-600 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Vehicle</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Registration No</label>
                  <input
                    type="text"
                    value={formData.registrationNo}
                    onChange={(e) => setFormData({...formData, registrationNo: e.target.value})}
                    className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Type</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Capacity (kg)</label>
                  <input
                    type="number"
                    value={formData.capacityKg}
                    onChange={(e) => setFormData({...formData, capacityKg: e.target.value})}
                    className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Ward</label>
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => setFormData({...formData, ward: e.target.value})}
                    className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="IN_USE">In Use</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="mr-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{vehicle.registrationNo}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Type: {vehicle.type}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Capacity: {vehicle.capacityKg} kg</p>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Ward: {vehicle.ward}</p>
            <p className={`text-sm ${vehicle.status === 'AVAILABLE' ? 'text-green-500 dark:text-green-400' : vehicle.status === 'IN_USE' ? 'text-blue-500 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>
              Status: {vehicle.status}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDelete(vehicle.id)}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleManagement;
