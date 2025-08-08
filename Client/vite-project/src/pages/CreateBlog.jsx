import React, { useState } from 'react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CreateBlog as CreateBlogAPI } from '../Apicalls/blog'; // Adjust path if different

const CreateBlog = () => {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to create a blog');
      return;
    }

    try {
      setLoading(true);
      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: currentUser.email,
      };

      const result = await CreateBlogAPI(blogData);
      if (result && result.blog && result.blog._id) {
        navigate(`/blog/${result.blog._id}`);
      } else {
        setError('Failed to create blog');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to create a blog post.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye size={18} className="mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {previewMode ? (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {formData.title || 'Your Blog Title'}
              </h1>
              <div className="text-gray-600 mb-6">
                <span className="font-medium">{currentUser.email}</span> ·{' '}
                <span>{formatDate(new Date())}</span>
              </div>
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {formData.content || 'Your blog content will appear here...'}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog Post</h1>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your blog title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-8">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here..."
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Content length: {formData.content.length} characters
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  {loading ? 'Publishing...' : 'Publish Blog'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {!previewMode && (
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Writing Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">Title Tips:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep it clear and engaging</li>
                  <li>Make it descriptive but concise</li>
                  <li>Consider your target audience</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Content Tips:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Start with a compelling introduction</li>
                  <li>Use paragraphs to break up content</li>
                  <li>End with a strong conclusion</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;
