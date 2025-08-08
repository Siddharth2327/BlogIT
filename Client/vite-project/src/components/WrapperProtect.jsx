import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetCurrentUser } from '../Apicalls/users';
import { setUser } from '../redux/userSlice';

function WrapperProtect({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        navigate('/login');
        return;
      }

      try {
        const response = await GetCurrentUser();
        if (response.success) {
          dispatch(setUser(response.data));
          setIsAuthenticated(true);
        } else {
          // Token is invalid
          localStorage.removeItem('token');
          dispatch(setUser(null));
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error("Error while validating user:", error);
        // Token is invalid or API error
        localStorage.removeItem('token');
        dispatch(setUser(null));
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    validateUser();
  }, [dispatch, navigate]);

  // Show loading spinner while validating
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only render children if authenticated
  if (isAuthenticated && user) {
    return <div>{children}</div>;
  }

  // If not authenticated, don't render anything (will redirect)
  return null;
}

export default WrapperProtect;