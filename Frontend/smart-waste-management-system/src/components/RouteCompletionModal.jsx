import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { employeeAPI } from '../api/client';
import { useTheme } from '../context/ThemeContext';

export default function RouteCompletionModal({ routeId, isOpen, onClose, onComplete }) {
  const [remark, setRemark] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!remark.trim()) {
      toast.error('Please enter a remark');
      return;
    }
    if (!photo) {
      toast.error('Please select a photo');
      return;
    }

    setLoading(true);
    try {
      // Convert photo to base64 for now (in production, upload to server)
      const photoData = photoPreview; // Using base64 for simplicity

      await employeeAPI.completeRoute({
        routeId,
        remark,
        photoUrl: photoData
      });

      toast.success('Route marked as complete!');
      onComplete();
      onClose();
      setRemark('');
      setPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      toast.error('Failed to complete route');
      console.error('Error completing route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setRemark('');
      setPhoto(null);
      setPhotoPreview(null);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-md rounded-lg shadow-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className={`p-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <h2 className="text-xl font-semibold mb-4">Complete Route</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Remark *
                  </label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter your remark about the collection..."
                    className={`w-full px-3 py-2 border rounded-md resize-none ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Photo of Collected Waste *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white'
                        : 'bg-white border-gray-300 text-gray-900 file:bg-gray-50 file:text-gray-700'
                    }`}
                    required
                  />
                  {photoPreview && (
                    <div className="mt-2">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                      isDarkMode
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    } disabled:opacity-50`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Completing...' : 'Complete Route'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
