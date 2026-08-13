import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

export const saveInterview = (data) => API.post('/interview/save', data);
export const getInterviewHistory = () => API.get('/interview/history');

export const evaluateAnswerAI = (data) => API.post('/interview/evaluate', data);

export const getInterviewStats = () => API.get('/interview/stats');

export const uploadResume = (formData) => API.post('/resume/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});