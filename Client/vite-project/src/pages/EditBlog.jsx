import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft, Save, X } from 'lucide-react';
import { GetBlogById, UpdateBlog } from '../Apicalls/blog';
import { useNavigate, useParams } from 'react-router-dom';

const EditBlog = () => {
  const { id } = useParams(); // blog id from route
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const [blog, setBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await GetBlogById(id);
      
      // Check if current user is the author
      if (currentUser && data.author !== currentUser.email) {
        setError('You are not authorized to edit this blog');
        return;
      }
      
      setBlog(data);
      setFormData({
        title: data.title,
        content: data.content
      });
    } catch (err) {
      setError('Blog not found or failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setSaving(true);
      await UpdateBlog(id, formData);
      navigate(`/blog/${id}`);
    } catch (err) {
      alert('Failed to update blog. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    navigate(`/blog/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blog...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'You are not authorized to edit this blog' ? 'Unauthorized' : 'Blog Not Found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'The blog you are looking for does not exist.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Cancel
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
          <div className="w-16"></div> {/* Spacer for center alignment */}
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Title Input */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg"
                placeholder="Enter your blog title..."
                required
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-8">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-vertical"
                placeholder="Write your blog content here..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Content length: {formData.content.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || (!formData.title.trim() || !formData.content.trim())}
                className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Save size={18} className="mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;