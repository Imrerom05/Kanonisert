
import { useState, type FormEvent } from 'react'

interface AuthFormProps {
  onLogin: (identifier: string, password: string) => Promise<unknown>
  onRegister: (email: string, username: string, password: string) => Promise<unknown>
}

/**
 * AuthForm
 *
 * Displays the login and registration forms.
 * Manages form inputs and forwards submissions
 * to the authentication page.
 */
function AuthForm({ onLogin, onRegister }: AuthFormProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  /** Handles login and registration form submissions. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    try {
      if (isRegistering) {
        await onRegister(email, username, password)
        setMessage('Your account has been created!')
      } else {
        await onLogin(identifier, password)
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    }
  }

  /** Switches between login and registration modes. */
  function toggleMode() {
    setIsRegistering(!isRegistering)
    setMessage('')
    setPassword('')
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
          {isRegistering ? 'Already a member? ' : 'New to Kanonisert? '}

          <button type="button" onClick={toggleMode}>
            {isRegistering ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default AuthForm
