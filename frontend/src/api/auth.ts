
/**
 * Authentication API
 *
 * Contains functions for communicating with the backend
 * authentication endpoints.
 */

const API_URL = 'http://localhost:3000/api/auth'

/** Represents the public user information returned by the API. */
export interface User {
  id: string
  username: string
  email: string
}

/** Logs in using an email address or username and password. */
export async function login(identifier: string, password: string): Promise<User> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ identifier, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Could not log in.')
  }

  return data.user
}

/** Creates a new user account. */
export async function register(
  email: string,
  username: string,
  password: string
): Promise<User> {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, username, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Could not create account.')
  }

  return data.user
}

/** Retrieves the currently authenticated user. */
export async function getCurrentUser(): Promise<User | null> {
  const response = await fetch(`${API_URL}/me`, {
    credentials: 'include',
  })

  if (response.status === 401) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Could not verify session.')
  }

  return data.user
}

/** Ends the current session and clears the session cookie. */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Could not sign out.')
  }
}
