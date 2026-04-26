import api from './axios'

export const getMyNotifications = () => api.get('/notifications/my')
export const markNotificationAsRead = (id) => api.patch(`/notifications/${id}/read`)
