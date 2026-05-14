import api from '../api/axiosInstance';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const skillsService = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

export const projectsService = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const blogService = {
  getAll: () => api.get('/blogs'),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

export const contactService = {
  create: (data) => api.post('/contacts', data),
};

export const resumeService = {
  getAll: () => api.get('/resume'),
  create: (data) => api.post('/resume', data),
  update: (id, data) => api.put(`/resume/${id}`, data),
};

export const profileService = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

export const uploadService = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadResume: (formData) => api.post('/upload/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
