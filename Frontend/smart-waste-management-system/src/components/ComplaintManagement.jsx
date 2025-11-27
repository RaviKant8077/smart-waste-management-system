import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../api/client';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchComplaints();
    fetchEmployees();
  }, [filter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getAllComplaints(filter);
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    // In a real app, you'd have an API to fetch employees
    // For now, we'll use mock data
    setEmployees([
      { id: 1, username: 'employee1' },
      { id: 2, username: 'employee2' },
      { id: 3, username: 'employee3' }
    ]);
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await complaintAPI.updateComplaintStatus(complaintId, newStatus);
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (err) {
      setError('Failed to update complaint status');
      console.error('Error updating complaint status:', err);
    }
  };

  const handleAssignEmployee = async (complaintId, employeeId) => {
    try {
      await complaintAPI.assignEmployee(complaintId, employeeId);
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (err) {
      setError('Failed to assign employee');
      console.error('Error assigning employee:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-orange-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Complaint Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="ALL">All Complaints</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedComplaint?.id === complaint.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedComplaint(complaint)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{complaint.title || 'Untitled Complaint'}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
              <div className="text-xs text-gray-500">
                <p>Reported by: {complaint.citizenName}</p>
                <p>Date: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                <p className={getPriorityColor(complaint.priority)}>Priority: {complaint.priority}</p>
                {complaint.assignedEmployee && <p>Assigned to: {complaint.assignedEmployee}</p>}
              </div>
            </div>
          ))}
        </div>

        {selectedComplaint && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Complaint Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="text-sm">{selectedComplaint.title || 'Untitled Complaint'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm">{selectedComplaint.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm">{selectedComplaint.location || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <p className={`text-sm ${getPriorityColor(selectedComplaint.priority)}`}>{selectedComplaint.priority}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="text-sm">{selectedComplaint.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reported by</label>
                <p className="text-sm">{selectedComplaint.citizenName}</p>
              </div>
              {selectedComplaint.assignedEmployee && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned Employee</label>
                  <p className="text-sm">{selectedComplaint.assignedEmployee}</p>
                </div>
              )}
              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedComplaint.images.map((image, index) => (
                      <img key={index} src={image} alt={`Complaint ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              {!selectedComplaint.assignedEmployee && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Employee</label>
                  <select
                    onChange={(e) => handleAssignEmployee(selectedComplaint.id, parseInt(e.target.value))}
                    className="w-full border rounded px-3 py-2 mb-2"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>{employee.username}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedComplaint.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusUpdate(selectedComplaint.id, 'IN_PROGRESS')}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Start Working
                </button>
              )}
              {selectedComplaint.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleStatusUpdate(selectedComplaint.id, 'RESOLVED')}
                  className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate(selectedComplaint.id, 'REJECTED')}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reject Complaint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintManagement;
