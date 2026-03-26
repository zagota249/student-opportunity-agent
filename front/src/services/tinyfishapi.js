import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 seconds default
});

// Long timeout for agent automation (3 minutes)
const agentApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 180000 // 3 minutes for automation
});

// Add token to requests
const addAuthToken = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
};

api.interceptors.request.use(addAuthToken);
agentApi.interceptors.request.use(addAuthToken);

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');

// Internship APIs
export const getInternships = () => api.get('/internships');
export const createInternship = (data) => api.post('/internships', data);
export const updateInternship = (id, data) => api.put(`/internships/${id}`, data);
export const deleteInternship = (id) => api.delete(`/internships/${id}`);

// Agent APIs (use long timeout)
export const applyLinkedIn = (data) => agentApi.post('/agent/linkedin', data);
export const applyIndeed = (data) => agentApi.post('/agent/indeed', data);
export const testTinyFishConnection = () => agentApi.get('/agent/test-connection', { timeout: 90000 });

// Job Search APIs (Live fetching)
export const searchJobs = (query, location, page = 1) =>
    api.get(`/jobs/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location || '')}&page=${page}`);
export const searchScholarships = (country) =>
    api.get(`/jobs/scholarships?country=${encodeURIComponent(country || '')}`);

export default api;