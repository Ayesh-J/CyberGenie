import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true, //  allow sending cookies (for sessions/auth)
});

//  Attach token before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  Auto-logout on 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

//  Export API methods
export const getProgressForUser = (userId) =>
  api.get(`/progress/${userId}`);

export const getProgressForModule = (userId, moduleId) =>
  api.get(`/progress/${userId}/${moduleId}`);

export const initProgress = (user_id, module_id) =>
  api.post('/progress', { user_id, module_id });

export const updateProgress = (userId, moduleId, progress_percent) =>
  api.put(`/progress/${userId}/${moduleId}`, { progress_percent });

export const getQuizQuestions = (moduleId) =>
  api.get(`/quiz/quizzes/${moduleId}`);

export default api;
