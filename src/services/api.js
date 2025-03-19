import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers["x-auth-token"]  = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API Functions
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data.data || [];
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data.data || [];
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/user');
    return response.data.data || [];
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

// Donor API Functions
export const donorAPI = {
  getAllDonors: async (params = {}) => {
    const response = await api.get('/donors', { params });
    console.log(response.data['data'])
    // Ensure we return the actual data array rather than the response wrapper
    return response.data
  },

  getDonorById: async (id) => {
    const response = await api.get(`/donors/${id}`);
    return response.data.data || [];
  },

  createDonor: async (donorData) => {
    const response = await api.post('/donors', donorData);
    return response.data.data || [];
  },

  updateDonor: async (id, donorData) => {
    const response = await api.put(`/donors/${id}`, donorData);
    return response.data.data || [];
  },

  deleteDonor: async (id) => {
    const response = await api.delete(`/donors/${id}`);
    return response.data.data || [];
  }
};

// Project API Functions
export const projectAPI = {
  getAllProjects: async (params = {}) => {
    const response = await api.get('/projects', { params });
    // Ensure we return the actual data array rather than the response wrapper
    return response.data.data || [];
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data.data || [];
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data.data || [];
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data.data || [];
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data.data || [];
  }
};

// Sponsorship API Functions
export const sponsorshipAPI = {
  getAllSponsorships: async (params = {}) => {
    const response = await api.get('/sponsorships', { params });
    // Ensure we return the actual data array rather than the response wrapper
    return response.data
  },

  getSponsorshipById: async (id) => {
    const response = await api.get(`/sponsorships/${id}`);
    return response.data.data || [];
  },

  createSponsorship: async (sponsorshipData) => {
    const response = await api.post('/sponsorships', sponsorshipData);
    return response.data.data || [];
  },

  updateSponsorship: async (id, sponsorshipData) => {
    const response = await api.put(`/sponsorships/${id}`, sponsorshipData);
    return response.data.data || [];
  },

  deleteSponsorship: async (id) => {
    const response = await api.delete(`/sponsorships/${id}`);
    return response.data.data || [];
  },
  
  // Additional sponsorship-specific functions could be added here
  getSponsorshipsByDonor: async (donorId) => {
    const response = await api.get(`/sponsorships/donor/${donorId}`);
    return response.data.data || [];
  },
  
  getSponsorshipsByProject: async (projectId) => {
    const response = await api.get(`/sponsorships/project/${projectId}`);
    return response.data.data || [];
  }
};

// Volunteer API Functions
export const volunteerAPI = {
  getAllVolunteers: async (params = {}) => {
    const response = await api.get('/volunteers', { params });
    return response.data.data || [];
  },

  getVolunteerById: async (id) => {
    const response = await api.get(`/volunteers/${id}`);
    return response.data.data || [];
  },

  createVolunteer: async (volunteerData) => {
    const response = await api.post('/volunteers', volunteerData);
    return response.data.data || [];
  },

  updateVolunteer: async (id, volunteerData) => {
    const response = await api.put(`/volunteers/${id}`, volunteerData);
    return response.data.data || [];
  },

  deleteVolunteer: async (id) => {
    const response = await api.delete(`/volunteers/${id}`);
    return response.data.data || [];
  },
  
  // Additional volunteer-specific functions could be added here
  getVolunteersByProject: async (projectId) => {
    const response = await api.get(`/volunteers/project/${projectId}`);
    return response.data.data || [];
  },
  
  getVolunteersBySkill: async (skill) => {
    const response = await api.get('/volunteers', { params: { skill } });
    return response.data.data || [];
  }
};

// Error handling helper
export const handleApiError = (error) => {
  const message = 
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred';
    
  // You can implement more advanced error handling here
  // For example, redirecting to login page on 401 errors
  if (error.response?.status === 401) {
    // Clear token and redirect to login
    localStorage.removeItem('token');
    // If using react-router: history.push('/login');
  }
  
  return { error: true, message };
};

export default {
  auth: authAPI,
  donors: donorAPI,
  projects: projectAPI,
  sponsorships: sponsorshipAPI,
  volunteers: volunteerAPI,
  handleApiError
};

