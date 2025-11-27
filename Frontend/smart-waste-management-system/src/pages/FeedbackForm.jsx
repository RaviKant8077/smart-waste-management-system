import React, { useState } from 'react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    rating: 5,
    category: '',
    subject: '',
    message: '',
    anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/citizen/feedback', formData);
      setSubmitted(true);
      toast.success('Thank you for your feedback!');
      setFormData({
        rating: 5,
        category: '',
        subject: '',
        message: '',
        anonymous: false
      });
    } catch (err) {
      toast.error('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your feedback has been submitted successfully.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Submit Feedback</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Overall Rating *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {formData.rating} out of 5 stars
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select a category</option>
            <option value="SERVICE">Service Quality</option>
            <option value="COLLECTION">Waste Collection</option>
            <option value="APP">Mobile App</option>
            <option value="STAFF">Staff Behavior</option>
            <option value="GENERAL">General</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Brief summary of your feedback"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Please provide detailed feedback..."
            rows={6}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Submit anonymously
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              rating: 5,
              category: '',
              subject: '',
              message: '',
              anonymous: false
            })}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Clear Form
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Privacy Notice</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Your feedback helps us improve our services. If you choose not to submit anonymously,
          your contact information may be used to follow up on your feedback.
        </p>
      </div>
    </div>
  );
};

export default FeedbackForm;
