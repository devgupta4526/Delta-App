"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "../types"
import { apiRequest } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: FormData) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (token) {
        // You might want to verify the token with the backend
        // For now, we'll assume it's valid if it exists
        setLoading(false)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest<{ user: User; accessToken: string; refreshToken: string }>(
        "POST",
        API_ENDPOINTS.LOGIN,
        { email, password },
      )

      const { user: userData, accessToken } = response.data
      localStorage.setItem("accessToken", accessToken)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: FormData) => {
    try {
      const response = await apiRequest<User>("POST", API_ENDPOINTS.REGISTER, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // After registration, you might want to auto-login
      // For now, we'll just return success
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiRequest("POST", API_ENDPOINTS.LOGOUT)
      localStorage.removeItem("accessToken")
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if logout fails, clear local state
      localStorage.removeItem("accessToken")
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
