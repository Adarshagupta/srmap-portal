import axios from 'axios';

// Backend URLs
const PRODUCTION_API_URL = 'https://srmap.onrender.com';
const LOCAL_API_URL = 'http://localhost:8000';

// Use production by default, can be overridden with environment variable
// Set NEXT_PUBLIC_API_URL=local in .env.local to use local backend
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL === 'local' 
    ? LOCAL_API_URL 
    : process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for production
});

export interface LoginCredentials {
  username: string;
  password: string;
  captcha?: string;  // Optional - will be auto-solved if not provided
  session_id?: string;  // Optional - will be created if not provided
}

export interface SessionRequest {
  session_id: string;
}

export const authAPI = {
  getCaptcha: async (): Promise<{ image: Blob; sessionId: string }> => {
    const response = await api.get('/api/captcha', {
      responseType: 'blob',
    });
    console.log('Captcha response headers:', response.headers);
    const sessionId = response.headers['x-session-id'] || response.headers['X-Session-ID'];
    console.log('Extracted session ID:', sessionId);
    return { image: response.data, sessionId };
  },

  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/api/login', credentials);
    return response.data;
  },

  logout: async (sessionId: string) => {
    const response = await api.delete('/api/logout', {
      data: { session_id: sessionId },
    });
    return response.data;
  },
};

export const studentAPI = {
  getProfile: async (sessionId: string) => {
    const response = await api.post('/api/student/profile', { session_id: sessionId });
    return response.data;
  },

  getCGPA: async (sessionId: string) => {
    const response = await api.post('/api/student/cgpa', { session_id: sessionId });
    return response.data;
  },

  getAttendance: async (sessionId: string) => {
    const response = await api.post('/api/student/attendance', { session_id: sessionId });
    return response.data;
  },

  getTimetable: async (sessionId: string) => {
    const response = await api.post('/api/student/timetable', { session_id: sessionId });
    return response.data;
  },

  getSubjects: async (sessionId: string) => {
    const response = await api.post('/api/student/subjects', { session_id: sessionId });
    return response.data;
  },

  getInternalMarks: async (sessionId: string) => {
    const response = await api.post('/api/student/internal-marks', { session_id: sessionId });
    return response.data;
  },

  getCurrentResults: async (sessionId: string) => {
    const response = await api.post('/api/student/current-semester-results', { session_id: sessionId });
    return response.data;
  },

  getODMLDetails: async (sessionId: string) => {
    const response = await api.post('/api/student/od-ml-details', { session_id: sessionId });
    return response.data;
  },
};

export const financeAPI = {
  getFeePaid: async (sessionId: string) => {
    const response = await api.post('/api/finance/fee-paid', { session_id: sessionId });
    return response.data;
  },

  getFeeDue: async (sessionId: string) => {
    const response = await api.post('/api/finance/fee-due', { session_id: sessionId });
    return response.data;
  },

  getBankDetails: async (sessionId: string) => {
    const response = await api.post('/api/finance/bank-details', { session_id: sessionId });
    return response.data;
  },
};

export const hostelAPI = {
  getRoomDetails: async (sessionId: string) => {
    const response = await api.post('/api/hostel/room-details', { session_id: sessionId });
    return response.data;
  },

  getBooking: async (sessionId: string) => {
    const response = await api.post('/api/hostel/booking', { session_id: sessionId });
    return response.data;
  },
};

export const transportAPI = {
  getRegistration: async (sessionId: string) => {
    const response = await api.post('/api/transport/registration', { session_id: sessionId });
    return response.data;
  },
};

export const announcementsAPI = {
  getAnnouncements: async (sessionId: string) => {
    const response = await api.post('/api/announcements', { session_id: sessionId });
    return response.data;
  },
};

export const feedbackAPI = {
  getEndSemesterFeedback: async (sessionId: string) => {
    const response = await api.post('/api/feedback/end-semester', { session_id: sessionId });
    return response.data;
  },
};

export const sapAPI = {
  getFeedback: async (sessionId: string) => {
    const response = await api.post('/api/sap/feedback', { session_id: sessionId });
    return response.data;
  },
};

export default api;
