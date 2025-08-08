import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Trash2, Plus, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GetAllBlogs, DeleteBlogById } from '../Apicalls/blog'; 

const MyBlogs = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchMyBlogs();
    }
  }, [currentUser]);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const data = await GetAllBlogs();
      if (data) {
        const userBlogs = data.filter((blog) => blog.author === currentUser.email);
        setBlogs(userBlogs);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(blogId);
      const deleted = await DeleteBlogById(blogId);
      if (deleted) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      alert('Error deleting blog');
    } finally {
      setDeleteLoading(null);
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

  const truncateContent = (content, limit = 100) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + '...';
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your blogs.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Login / Register
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your blogs...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex  items-center mb-4 sm:mb-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-emerald-600 hover:text-emerald-700 mr-4 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
              <p className="text-gray-600 mt-1">Manage your published articles</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/create')}
            className="flex items-center bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <Plus size={18} className="mr-2" />
            Create New Blog
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchMyBlogs}
              className="mt-2 text-red-700 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Blogs List */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-6">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No blogs yet</h3>
            <p className="text-gray-600 mb-6">Start sharing your thoughts with the world!</p>
            <button 
              onClick={() => navigate('/create')}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Write Your First Blog
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0 lg:mr-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-emerald-600 cursor-pointer transition-colors"
                          onClick={() => navigate(`/blog/${blog._id}`)}>
                        {blog.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {truncateContent(blog.content)}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          <span>Published {formatDate(blog.createdAt)}</span>
                        </div>
                        {blog.updatedAt !== blog.createdAt && (
                          <div className="flex items-center">
                            <span>Updated {formatDate(blog.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                      <button
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        className="flex items-center px-3 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      
                      <button
                        onClick={() => navigate(`/edit/${blog._id}`)}
                        className="flex items-center px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(blog._id, blog.title)}
                        disabled={deleteLoading === blog._id}
                        className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} className="mr-1" />
                        {deleteLoading === blog._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {blogs.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Blog Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{blogs.length}</div>
                <div className="text-gray-600">Total Blogs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {blogs.reduce((total, blog) => total + blog.content.length, 0)}
                </div>
                <div className="text-gray-600">Total Characters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.round(blogs.reduce((total, blog) => total + blog.content.split(' ').length, 0))}
                </div>
                <div className="text-gray-600">Total Words</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;