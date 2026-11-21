
import { useEffect, useState } from 'react'
import {
  login,
  register,
  getCurrentUser,
  logout,
  type User,
} from '../api/auth'

/**
 * useAuth
 *
 * Manages the application's authentication state.
 * Handles session restoration, login, registration and logout.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  /**
   * Restores an existing login session when the application starts.
   */
  useEffect(() => {
    async function checkSession() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Could not restore session:', error)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  /** Logs in and updates the authenticated user. */
  async function signIn(identifier: string, password: string) {
    const authenticatedUser = await login(identifier, password)
    setUser(authenticatedUser)
    return authenticatedUser
  }

  /** Registers a new account. */
  async function signUp(email: string, username: string, password: string) {
    return register(email, username, password)
  }

  /** Logs out and clears the authenticated user. */
  async function signOut() {
    await logout()
    setUser(null)
  }

  return {
    user,
    isCheckingSession,
    signIn,
    signUp,
    signOut,
  }
}
