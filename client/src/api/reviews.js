import api from './axios'

export const addReview = (reviewData) => api.post('/reviews', reviewData)
export const getWorkerReviews = (workerId) => api.get(`/reviews/worker/${workerId}`)
export const getAllReviews = () => api.get('/reviews')
export const deleteReview = (id) => api.delete(`/reviews/${id}`)
