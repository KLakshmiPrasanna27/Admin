const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || '/api'
  : 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle responses
const handleResponse = async (response) => {
  const responseJson = await response.json().catch(() => ({ message: 'Network error' }));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(responseJson.message || 'Request failed');
  }

  return { data: responseJson };
};

const safeFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    throw new Error(
      error.message === 'Failed to fetch'
        ? 'Unable to reach the backend API. Make sure the server is running and the API URL is correct.'
        : error.message
    );
  }
};

// Auth APIs
export const authAPI = {
  signup: async (data) => {
    return safeFetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  login: async (email, password) => {
    return safeFetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },
  getMe: async () => {
    return safeFetch(`${API_URL}/users/me`, {
      headers: getAuthHeaders()
    });
  },
  updateProfile: async (data) => {
    return safeFetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },
  getAllUsers: async () => {
    return safeFetch(`${API_URL}/users/all-users`, {
      headers: getAuthHeaders()
    });
  }
};

// Project APIs
export const projectAPI = {
  createProject: async (data) => {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  getProjects: async () => {
    const response = await fetch(`${API_URL}/projects`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  getProjectById: async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  updateProject: async (id, data) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  deleteProject: async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  addMember: async (id, memberId) => {
    const response = await fetch(`${API_URL}/projects/${id}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ memberId })
    });
    return handleResponse(response);
  },
  removeMember: async (id, memberId) => {
    const response = await fetch(`${API_URL}/projects/${id}/members`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ memberId })
    });
    return handleResponse(response);
  }
};

// Task APIs
export const taskAPI = {
  createTask: async (data) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  getTasks: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const url = queryString ? `${API_URL}/tasks?${queryString}` : `${API_URL}/tasks`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  getTaskById: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  updateTask: async (id, data) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  deleteTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  getDashboardStats: async () => {
    const response = await fetch(`${API_URL}/tasks/stats/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  addComment: async (id, text) => {
    const response = await fetch(`${API_URL}/tasks/${id}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text })
    });
    return handleResponse(response);
  }
};

export default { authAPI, projectAPI, taskAPI };
