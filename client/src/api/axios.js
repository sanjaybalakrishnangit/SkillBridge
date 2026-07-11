import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lwc_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — clear auth and redirect to login only if user was authenticated
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadToken = !!localStorage.getItem('lwc_token')
      localStorage.removeItem('lwc_token')
      localStorage.removeItem('lwc_user')
      if (hadToken) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
