import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../api/client';

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getMyComplaints();
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-6">My Complaints</h1>

      {complaints.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No complaints found</h3>
          <p>You haven't submitted any complaints yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedComplaint(complaint)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{complaint.title || 'Untitled Complaint'}</h3>
                  <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    <span className={getPriorityColor(complaint.priority)}>
                      Priority: {complaint.priority || 'MEDIUM'}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Location: {complaint.location || 'Not specified'}</span>
                  {complaint.assignedEmployee && (
                    <span className="text-gray-600">Assigned to: {complaint.assignedEmployee.username}</span>
                  )}
                </div>
                {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                  <span className="text-gray-500">
                    Last updated: {new Date(complaint.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedComplaint(null)}>
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Complaint Details</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-sm mt-1">{selectedComplaint.title || 'Untitled Complaint'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm mt-1">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span className={`text-sm font-medium mt-1 ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority || 'MEDIUM'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm mt-1">{selectedComplaint.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-sm mt-1">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedComplaint.assignedEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned Employee</label>
                    <p className="text-sm mt-1">{selectedComplaint.assignedEmployee.username}</p>
                  </div>
                )}

                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedComplaint.images.map((image, index) => (
                        <img key={index} src={image} alt={`Complaint ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                      ))}
                    </div>
                  </div>
                )}

                {selectedComplaint.updates && selectedComplaint.updates.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Updates</label>
                    <div className="space-y-2">
                      {selectedComplaint.updates.map((update, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <p className="text-sm">{update.message}</p>
                          <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ComplaintStatus.displayName = 'ComplaintStatus';

export default ComplaintStatus;
