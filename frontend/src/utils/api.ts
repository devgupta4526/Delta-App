import axios, { type AxiosResponse } from "axios"
import API_BASE_URL from "../config/api"
import type { ApiResponse } from "../types"

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await api.post("/users/refresh-token")
        const { accessToken } = response.data.data
        localStorage.setItem("accessToken", accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  config?: any
)
: Promise<ApiResponse<T>> =>
{
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api({
      method,
      url,
      data,
      ...config,
    })
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export default api
