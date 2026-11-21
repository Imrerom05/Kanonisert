import { Link } from 'react-router-dom'

interface NavigationProps {
  onLogout: () => void
}

/**
 * Navigation
 *
 * Provides navigation between the main pages
 * and access to the sign-out action.
 */
function Navigation({ onLogout }: NavigationProps) {
  return (
    <header className="dashboard-header">
      <div className="brand">KANONISERT</div>

      <nav className="dashboard-nav">
        <Link to="/">Home</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <button className="logout-button" onClick={onLogout}>
        Sign Out
      </button>
    </header>
  )
}

export default Navigation