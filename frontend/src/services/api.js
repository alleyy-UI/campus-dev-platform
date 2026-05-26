import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  follow: (id) => api.post(`/users/${id}/follow`),
  unfollow: (id) => api.post(`/users/${id}/unfollow`),
};

export const postAPI = {
  getAll: (params) => api.get('/posts', { params }),
  create: (data) => api.post('/posts', data),
  getById: (id) => api.get(`/posts/${id}`),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.put(`/posts/${id}/like`),
};

export const commentAPI = {
  getAll: (postId) => api.get(`/comments/posts/${postId}`),
  create: (postId, data) => api.post(`/comments/posts/${postId}`, data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  like: (id) => api.put(`/comments/${id}/like`),
  setBestAnswer: (id) => api.put(`/comments/${id}/best-answer`),
};

export const codeAPI = {
  run: (data) => api.post('/code/run', data),
};

export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  create: (data) => api.post('/projects', data),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const tagAPI = {
  getAll: () => api.get('/tags'),
};

export default api;