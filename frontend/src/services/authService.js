import API from './api'

export const register = d => API.post('/auth/register', d)
export const login = d => API.post('/auth/login', d)
export const forgotPassword = email => API.post('/auth/forgot-password', { email })
export const resetPassword = (token, newPassword) => API.post('/auth/reset-password', { token, newPassword })

export const getProfile = () => API.get('/users/profile')
export const updateProfile = d => API.put('/users/profile', d)
export const changePassword = d => API.put('/users/change-password', d)

export const uploadResume = fd => API.post('/resumes/upload', fd)
export const getMyResumes = () => API.get('/resumes')

export const startInterview = d => API.post('/interviews/start', d)
export const getQuestions = id => API.get(`/interviews/${id}/questions`)
export const submitAnswer = (id, d) => API.post(`/interviews/${id}/answer`, d)
export const completeInterview = id => API.post(`/interviews/${id}/complete`)
export const getResults = id => API.get(`/interviews/${id}/results`)
export const getFeedback = id => API.get(`/interviews/${id}/feedback`)
export const getMyInterviews = () => API.get('/interviews/my')

export const getDashboard = () => API.get('/dashboard')

export const adminGetUsers = () => API.get('/admin/users')
export const adminToggleUser = id => API.put(`/admin/users/${id}/toggle`)
export const adminDeleteUser = id => API.delete(`/admin/users/${id}`)
export const adminGetQuestions = () => API.get('/admin/questions')
export const adminAddQuestion = d => API.post('/admin/questions', d)
export const adminUpdateQuestion = (id, d) => API.put(`/admin/questions/${id}`, d)
export const adminDeleteQuestion = id => API.delete(`/admin/questions/${id}`)
export const adminGetStats = () => API.get('/admin/stats')
