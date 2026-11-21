import Navigation from '../components/layout/Navigation'




interface DiscoverProps {
  onLogout: () => void
}


/**
 * Discover page.
 *
 * Will contain book discovery features
 * and recommendations in the future.
 */
function Discover({ onLogout }: DiscoverProps) {
    return (
        <main className="dashboard">
            <Navigation onLogout={onLogout} />

            <section className="dashboard-content">
                <h1>Discover</h1>
                <p>Explore new books and discover your next favourite story.</p>
            </section>
        </main>
    )
}

export default Discover