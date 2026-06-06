// API URL: production Railway
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://saas-leads-production.up.railway.app/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getLeads = () => API.get('/leads');
export const createLead = (data) => API.post('/leads', data);
export const updateLeadStatus = (id, status) => API.patch(`/leads/${id}/status`, { status });
export const getAppointments = () => API.get('/appointments');
export const createAppointment = (data) => API.post('/appointments', data);
export const getConversations = () => API.get('/conversations');
export const getMessages = (convId) => API.get(`/conversations/${convId}/messages`);

export default API;