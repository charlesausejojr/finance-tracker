"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken")
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
    }
  }, [])

  const logout = () => {
    sessionStorage.removeItem("authToken")
    setToken(null)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ token, isAuthenticated, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
