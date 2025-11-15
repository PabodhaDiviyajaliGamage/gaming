// API Configuration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    verify: `${API_BASE_URL}/auth/verify`,
  },
  users: `${API_BASE_URL}/users`,
  games: `${API_BASE_URL}/games`,
  packages: `${API_BASE_URL}/packages`,
  orders: `${API_BASE_URL}/orders`,
}

export const API_CONFIG = {
  API_BASE_URL,
  API_ENDPOINTS,
  LOGGING_ENABLED: process.env.VITE_API_LOGGING === 'true',
}

const apiConfig = {
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
}

export default apiConfig
