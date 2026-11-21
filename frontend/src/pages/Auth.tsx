
import AuthForm from '../components/auth/AuthForm'
import type { User } from '../api/auth'

interface AuthProps {
  onLogin: (identifier: string, password: string) => Promise<User>
  onRegister: (email: string, username: string, password: string) => Promise<User>
}

/**
 * Authentication page.
 *
 * Presents the authentication form and forwards
 * login and registration requests to the parent application.
 */
function Auth({ onLogin, onRegister }: AuthProps) {
  return (
    <AuthForm
      onLogin={onLogin}
      onRegister={onRegister}
    />
  )
}

export default Auth
