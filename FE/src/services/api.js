import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for handling 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// 1. Auth API
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// 2. User API (Admin only)
export const userApi = {
  getAll: () => api.get('/users'),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
  toggleActive: (id) => api.patch(`/users/${id}/toggle-active`),
  delete: (id) => api.delete(`/users/${id}`),
};

// 3. Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getOne: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// 4. Expenses API
export const expensesApi = {
  // User operations
  getAll: (params) => api.get('/expenses', { params }),
  getOne: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.patch(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getStatistics: (params) => api.get('/expenses/statistics', { params }),
  getMonthlyReport: (year) => api.get('/expenses/monthly-report', { params: { year } }),

  // Admin operations
  getAllAdmin: (params) => api.get('/expenses/admin/all', { params }),
  getAdminStats: () => api.get('/expenses/admin/stats'),
  adminDelete: (id) => api.delete(`/expenses/admin/${id}`),
};

// 5. Edit Requests API
export const editRequestsApi = {
  // User operations
  create: (data) => api.post('/edit-requests', data),
  getMyRequests: () => api.get('/edit-requests/my'),

  // Admin operations
  getAllAdmin: (params) => api.get('/edit-requests', { params }),
  getOne: (id) => api.get(`/edit-requests/${id}`),
  approve: (id, data) => api.patch(`/edit-requests/${id}/approve`, data),
  reject: (id, data) => api.patch(`/edit-requests/${id}/reject`, data),
};

export default api;
