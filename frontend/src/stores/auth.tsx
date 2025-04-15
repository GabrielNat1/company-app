import React, { createContext,  useState, useCallback, ReactNode } from 'react'
import { api } from '../lib/axios'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextData {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@EventHub:user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const { user: userData, token } = response.data

    localStorage.setItem('@EventHub:user', JSON.stringify(userData))
    localStorage.setItem('@EventHub:token', token)
    setUser(userData)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@EventHub:user')
    localStorage.removeItem('@EventHub:token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Removed useAuth hook to comply with Fast Refresh requirements.
