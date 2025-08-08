import axios from 'axios'

//  Replace your current axios instance with this:
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Add your server URL
    headers: {
        "Content-Type": "application/json",
    }
})

//  Add this interceptor to handle authentication automatically
axiosInstance.interceptors.request.use(
    function (config) {
        // Get fresh token every time a request is made
        const token = localStorage.getItem('token');
        
        if (token && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);



//  Handle auth errors automatically
axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);