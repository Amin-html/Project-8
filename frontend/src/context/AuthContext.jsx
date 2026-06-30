import { createContext, useContext, useState } from 'react'
import API from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [userId, setUserId] = useState(localStorage.getItem('userId'))

  const login = async (username, password) => {
    const res = await API.post('/auth/login/', { username, password })
    localStorage.setItem('token', res.data.access)
    localStorage.setItem('username', res.data.username || username)
    localStorage.setItem('userId', res.data.user_id)
    setToken(res.data.access)
    setUsername(res.data.username || username)
    setUserId(res.data.user_id)
  }

  const register = async (username, password, email) => {
    const res = await API.post('/auth/register/', { username, password, email })
    localStorage.setItem('token', res.data.access)
    localStorage.setItem('username', res.data.username)
    localStorage.setItem('userId', res.data.user_id)
    setToken(res.data.access)
    setUsername(res.data.username)
    setUserId(res.data.user_id)
  }

  const logout = () => {
    localStorage.clear()
    setToken(null)
    setUsername(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, userId, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)