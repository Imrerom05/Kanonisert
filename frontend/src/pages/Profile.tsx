import Navigation from '../components/layout/Navigation'


interface ProfileProps {
  onLogout: () => void
}



/**
 * Profile page.
 *
 * Will display the user's profile,
 * favourite books and reading activity.
 */
function Profile({ onLogout }: ProfileProps) {
    return (
        <main className="dashboard">
            <Navigation onLogout={onLogout} />

            <section className="dashboard-content">
                <h1>Profile</h1>
                <p>Your literary identity starts here.</p>
            </section>
        </main>
    )
}

export default Profile