import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // Removed withCredentials: true because JWT auth uses Authorization header
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
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

// Quiz calls unchanged
export const getQuizQuestions = (moduleId) =>
  api.get(`/quiz/quizzes/${moduleId}`);

export default api;
