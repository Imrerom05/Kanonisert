import { useEffect, useState } from 'react'
import './App.css'
import type { Work } from './types/work'
import { searchWorks } from './api/works'


function App() {
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Work[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

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
     <main className="dashboard">
        <header className="dashboard-header">
          <div className="brand">KANONISERT</div>

          <nav className="dashboard-nav">
            <button>Home</button>
            <button>Discover</button>
            <button>My Library</button>
            <button>Friends</button>
          </nav>

         <button
            className="logout-button"
            onClick={handleLogout}
         >
            Sign Out
          </button>
        </header>

        <section className="dashboard-content">
         <section className="dashboard-content">
  <div className="dashboard-welcome">
    <h1>Welcome back, {user.username}.</h1>
    <p>Discover stories. Share your reading journey.</p>
  </div>

<div className="book-search">
  <input
    type="text"
    placeholder="Search books, authors and genres..."
    value={searchQuery}
    onChange={(event) => setSearchQuery(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === 'Enter') handleBookSearch()
    }}
  />
  <button onClick={handleBookSearch} disabled={isSearching}>
    {isSearching ? 'Searching...' : 'Search'}
  </button>
    </div>

    {searchError && (
  <p className="search-error">{searchError}</p>
)}

{isSearching && (
  <p className="search-status">Searching the library...</p>
)}

{searchResults.length > 0 && (
  <section className="search-results">
    <h2>Search Results</h2>

    <div className="results-grid">
      {searchResults.map((work) => (
        <article className="result-card" key={work.work_id}>
          {work.cover_image_url && (
            <img
              src={work.cover_image_url}
              alt={`Cover of ${work.title}`}
            />
          )}

          <h3>{work.title}</h3>

          {work.original_year && <p>{work.original_year}</p>}
        </article>
      ))}
    </div>
  </section>
)}

  <section className="feed-section">
    <h2>New from Friends</h2>

    <div className="feed-placeholder">
      <span className="shelf-symbol">✦</span>
      <h3>Your friends' reading journeys</h3>
      <p>
        New books, reviews and reading updates from your friends
        will appear here.
      </p>
    </div>
  </section>



  <section className="feed-section">
    <h2>Popular Now</h2>

    <div className="popular-grid">
      <article className="popular-card">
        <div className="book-placeholder">BOOK I</div>
        <h3>Discover new stories</h3>
        <p>Explore books loved by the community.</p>
      </article>

      <article className="popular-card">
        <div className="book-placeholder">BOOK II</div>
        <h3>Find your next favourite</h3>
        <p>See what other readers are enjoying.</p>
      </article>

      <article className="popular-card">
        <div className="book-placeholder">BOOK III</div>
        <h3>Expand your collection</h3>
        <p>There is always another story waiting.</p>
      </article>
    </div>
      </section>
      </section>
      </section>
    </main>
  )
  }

  async function handleBookSearch() {
  if (!searchQuery.trim()) return

  setIsSearching(true)
  setSearchError('')
  setSearchResults([])

  try {
    const works = await searchWorks(searchQuery)
    setSearchResults(works)
  } catch {
    setSearchError('Could not search for books. Please try again.')
  } finally {
    setIsSearching(false)
  }
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
