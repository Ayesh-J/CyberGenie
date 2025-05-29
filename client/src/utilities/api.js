import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Progress-related calls
export const getProgressForUser = (userId) =>
  api.get(`/progress/${userId}`);

export const getProgressForModule = (userId, moduleId) =>
  api.get(`/progress/${userId}/${moduleId}`);

export const initProgress = (user_id, module_id) =>
  api.post('/progress', { user_id, module_id });

export const updateProgress = (userId, moduleId, progress_percent) =>
  api.put(`/progress/${userId}/${moduleId}`, { progress_percent });

export default api;
