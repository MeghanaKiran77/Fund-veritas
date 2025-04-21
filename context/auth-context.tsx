"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "backer" | "creator" | "admin" | null

interface User {
  name: string
  email: string
  role: UserRole
  walletAddress?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, role: UserRole) => void
  signup: (name: string, email: string, role: UserRole) => void
  logout: () => void
  connectWallet: (address: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("fundveritas_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
  }, [])

  // Simple login function - just store the user role
  const login = (email: string, role: UserRole) => {
    const newUser = {
      name: email.split("@")[0], // Simple name from email
      email,
      role,
    }
    setUser(newUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("fundveritas_user", JSON.stringify(newUser))
    }
  }

  // Simple signup function - just store the user info
  const signup = (name: string, email: string, role: UserRole) => {
    const newUser = {
      name,
      email,
      role,
    }
    setUser(newUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("fundveritas_user", JSON.stringify(newUser))
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("fundveritas_user")
    }
  }

  // Connect wallet
  const connectWallet = (address: string) => {
    if (user) {
      const updatedUser = { ...user, walletAddress: address }
      setUser(updatedUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("fundveritas_user", JSON.stringify(updatedUser))
      }
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, connectWallet }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
