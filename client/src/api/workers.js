import api from './axios'

export const getWorkers = (params) => api.get('/workers', { params })
export const getMyProfile = () => api.get('/workers/me')
export const getWorkerById = (id) => api.get(`/workers/${id}`)
export const createWorker = (formData) =>
  api.post('/workers', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateWorker = (id, formData) =>
  api.put(`/workers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const toggleVerification = (id) => api.patch(`/workers/${id}/verify`)
export const deleteWorker = (id) => api.delete(`/workers/${id}`)
