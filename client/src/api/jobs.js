import api from './axios'

export const getJobs = () => api.get('/jobs')
export const getJobById = (id) => api.get(`/jobs/${id}`)
export const createJob = (formData) =>
  api.post('/jobs', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateJob = (id, formData) =>
  api.put(`/jobs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteJob = (id) => api.delete(`/jobs/${id}`)
