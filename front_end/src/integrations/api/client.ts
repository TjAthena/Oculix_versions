// API client for Django backend
import axios from 'axios';

// Set your Django API URL here
const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          // Store the new tokens
          localStorage.setItem('authToken', response.data.access);
          
          // Update the authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If token refresh fails, log out
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (email: string, password: string) => 
    apiClient.post('/api/auth/login/', { email, password }),
  register: (userData: any) => 
    apiClient.post('/api/auth/register/', userData),
  logout: () => 
    apiClient.post('/api/auth/logout/'),
  getUser: () => 
    apiClient.get('/api/auth/user/'),
  refreshToken: (refresh: string) =>
    apiClient.post('/api/auth/token/refresh/', { refresh }),
  getUsers: () => apiClient.get('/api/auth/users/'),
  getUserCounts: () => apiClient.get('/api/user-counts/'),
};

export const clientsAPI = {
  getClients: () => 
    apiClient.get('/api/clients/'),
  getClient: (id: string) => 
    apiClient.get(`/api/clients/${id}/`),
  createClient: (data: any) => 
    apiClient.post('/api/clients/', data),
  updateClient: (id: string, data: any) => 
    apiClient.put(`/api/clients/${id}/`, data),
  deleteClient: (id: string) => 
    apiClient.delete(`/api/clients/${id}/`),
  getClientReportCount: (id: string) =>
    apiClient.get(`/api/clients/${id}/report-count/`),
};

export const reportsAPI = {
  getReports: (clientId?: string) =>
    clientId ? apiClient.get(`/api/reports/?client_id=${clientId}`) : apiClient.get('/api/reports/'),
  getReport: (id: string) =>
    apiClient.get(`/api/reports/${id}/`),
  createReport: (data: any) =>
    apiClient.post('/api/reports/', data),
  updateReport: (id: string, data: any) =>
    apiClient.put(`/api/reports/${id}/`, data),
  deleteReport: (id: string) =>
    apiClient.delete(`/api/reports/${id}/`),
};
