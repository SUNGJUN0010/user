import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  withCredentials: true // refresh 쿠키 사용
})

// Access Token 자동 첨부 인터셉터(옵션)
let accessToken = null
export const setAccessToken = (token) => { accessToken = token }

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// 401 시 refresh 시도
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry && !original.url.includes('/refresh')) {
      original._retry = true
      try {
        const { data } = await api.post('/api/auth/refresh')
        if (data.access_token) {
          setAccessToken(data.access_token)
          original.headers.Authorization = `Bearer ${data.access_token}`
          return api(original)
        }
      } catch (_) {}
    }
    return Promise.reject(error)
  }
)

export default api
