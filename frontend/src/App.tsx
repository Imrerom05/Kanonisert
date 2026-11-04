import { useEffect, useState } from 'react'
import './App.css'


function App() {
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
  async function checkSession() {
    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch {
      console.log('No active session found.')
    } finally {
      setIsCheckingSession(false)
    }
  }

  checkSession()
}, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    const endpoint = isRegistering
      ? '/api/auth/register'
      : '/api/auth/login'

    const body = isRegistering
      ? { email, username, password }
      : { identifier, password }

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Something went wrong.')
        return
      }

      if (!isRegistering) {
        setUser(data.user)
      }

      setMessage(
        isRegistering
          ? 'Your account has been created!'
          : `Welcome back, ${data.user.username}!`
      )
    } catch {
      setMessage('Could not connect to Kanonisert. Please try again.')
    }
  }

  if (isCheckingSession) {
    return <main className="auth-page">Loading Kanonisert...</main>
  }

  if (user) {
  return (
    <main className="auth-page">
      <section className="auth-container">
        <div className="brand">KANONISERT</div>
        <div className="brand-subtitle">The art of reading</div>
        <h1 className="auth-title">Welcome back, {user.username}!</h1>
        <p className="auth-description">Your next chapter awaits.</p>

        <button
          className="auth-button"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </section>
    </main>
  )
  }

  async function handleLogout() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      setMessage('Could not sign out. Please try again.')
      return
    }

    setUser(null)
    setMessage('You have been signed out.')
  } catch {
    setMessage('Could not connect to Kanonisert.')
  }
}

  return (
    <main className="auth-page">
      <section className="auth-container">
        <div className="brand">KANONISERT</div>

        <h1 className="auth-title">
          {isRegistering ? 'Join the community' : 'Welcome Back'}
        </h1>

        <p className="auth-description">
          {isRegistering
            ? 'Create an account and begin your literary journey.'
            : 'Your next chapter begins here.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering ? (
            <>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  required
                />
              </label>

              <label>
                Username
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Choose a username"
                  minLength={3}
                  maxLength={20}
                  required
                />
              </label>
            </>
          ) : (
            <label>
              Email or Username
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Your email or username"
                required
              />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              minLength={isRegistering ? 8 : undefined}
              required
            />
          </label>

          <button className="auth-button" type="submit">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}

        <div className="auth-switch">
          {isRegistering
            ? 'Already a member? '
            : 'New to Kanonisert? '}

          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering)
              setMessage('')
              setPassword('')
            }}
          >
            {isRegistering ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
