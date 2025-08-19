import api, { setAccessToken } from './client'

export const register = (payload) => api.post('/api/auth/register', payload)
export const login = async (payload) => {
  const { data } = await api.post('/api/auth/login', payload)
  if (data.access_token) setAccessToken(data.access_token)
  return data
}
export const logout = async () => {
  await api.post('/api/auth/logout')
  setAccessToken(null)
}
export const me = async () => (await api.get('/api/auth/me')).data
export const updateMe = async (payload) => (await api.put('/api/users/me', payload)).data
export const changePassword = async (payload) => (await api.put('/api/users/me/password', payload)).data
export const forgotPassword = async (email) => (await api.post('/api/auth/forgot-password', { email })).data
export const forgotUsername = async (email) => (await api.post('/api/auth/forgot-username', { email })).data
export const deleteAccount = async () => (await api.delete('/api/auth/delete-account')).data
export const clearAccessToken = () => { setAccessToken(null) }
export const resetPassword = async (payload) => (await api.post('/api/auth/reset-password', payload)).data
