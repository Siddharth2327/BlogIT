import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { GetBlogById, DeleteBlogById } from '../Apicalls/blog';
import { useNavigate, useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams(); // id from route
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await GetBlogById(id);
      setBlog(data);
    } catch (err) {
      setError('Blog not found or failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;

    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('token');
      await DeleteBlogById(id, token);
      navigate('/my-blogs');
    } catch (err) {
      alert('Failed to delete blog');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = currentUser && blog && currentUser.email === blog.author;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        {/* Blog Content */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {blog.title}
                </h1>

                {isAuthor && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => navigate(`/edit/${blog._id}`)}
                      className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Blog"
                    >
                      <Edit size={18} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete Blog"
                    >
                      <Trash2 size={18} className="mr-1" />
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center text-gray-600 space-x-6">
                <div className="flex items-center">
                  <User size={18} className="mr-2" />
                  <span className="font-medium">{blog.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span>Published on {formatDate(blog.createdAt)}</span>
                </div>
                {blog.updatedAt !== blog.createdAt && (
                  <div className="flex items-center text-sm">
                    <span>Updated on {formatDate(blog.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{blog.content}</div>
            </div>
          </div>
        </article>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Read More Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
