import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 }); // 7 days
    }
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    Cookies.remove('token');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  }
};

// Todo API calls
export const todoAPI = {
  getTodos: async () => {
    const response = await api.get('/lists');
    return response.data;
  },
  
  createTodo: async (todoData: { title: string; description?: string; priority: string }) => {
    const response = await api.post('/lists', todoData);
    return response.data;
  },
  
  updateTodo: async (id: string, todoData: Partial<{ title: string; description: string; status: boolean; priority: string }>) => {
    const response = await api.patch(`/lists/${id}`, todoData);
    return response.data;
  },
  
  deleteTodo: async (id: string) => {
    const response = await api.delete(`/lists/${id}`);
    return response.data;
  },
  
  getTodoById: async (id: string) => {
    const response = await api.get(`/lists/${id}`);
    return response.data;
  }
};

// Types
export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: boolean;
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default api;