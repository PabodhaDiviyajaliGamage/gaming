// API utility functions for MongoDB operations

const API_BASE = '/api'

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }

  return data
}

// Games API
export const gamesAPI = {
  getAll: () => fetchAPI('/games'),
  getById: (id) => fetchAPI(`/games/${id}`),
  create: (data) => fetchAPI('/games', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/games/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/games/${id}`, { method: 'DELETE' }),
}

// Packages API
export const packagesAPI = {
  getAll: () => fetchAPI('/packages'),
  getById: (id) => fetchAPI(`/packages/${id}`),
  create: (data) => fetchAPI('/packages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/packages/${id}`, { method: 'DELETE' }),
}

// Orders API
export const ordersAPI = {
  getAll: () => fetchAPI('/orders'),
  getById: (id) => fetchAPI(`/orders/${id}`),
  create: (data) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/orders/${id}`, { method: 'DELETE' }),
}

// Users API
export const usersAPI = {
  getAll: () => fetchAPI('/users'),
  register: (data) => fetchAPI('/users', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
}
