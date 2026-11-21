import type { User } from '../api/auth'
import type { ReadingListItem } from '../api/readingList'
import type { Work, FullWork } from '../types/work'
import Navigation from '../components/layout/Navigation'


interface HomeProps {
    user: User
    readingList: ReadingListItem[]
    isLoadingReadingList: boolean
    readingListMessage: string
    isAddingToReadingList: boolean

    searchQuery: string
    onSearchQueryChange: (query: string) => void
    searchResults: Work[]
    isSearching: boolean
    searchError: string
    selectedWork: FullWork | null
    isLoadingWork: boolean

    onSearch: () => void
    onSelectWork: (workId: number) => void
    onClearSelectedWork: () => void
    onAddToReadingList: (workId: number) => void
    onLogout: () => void
}

/**
 * Home page
 *
 * Displays the user's dashboard, including
 * book discovery, reading list and friends' activity.
 */

function Home({
    user,
    readingList,
    isLoadingReadingList,
    readingListMessage,
    isAddingToReadingList,
    searchQuery,
    onSearchQueryChange,
    searchResults,
    isSearching,
    searchError,
    selectedWork,
    isLoadingWork,
    onSearch,
    onSelectWork,
    onClearSelectedWork,
    onAddToReadingList,
    onLogout,
}: HomeProps) {

    return (
        <main className="dashboard">
            <Navigation onLogout={onLogout} />

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
                        onChange={(event) => onSearchQueryChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') onSearch()
                        }}
                    />

                    <button onClick={onSearch} disabled={isSearching}>
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
                                <article
                                    className="result-card"
                                    key={work.work_id}
                                    onClick={() => onSelectWork(work.work_id)}
                                >
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

                {isLoadingWork && (
                    <p className="search-status">Loading work details...</p>
                )}

                {selectedWork && (
                    <section className="work-details">
                        <button onClick={onClearSelectedWork}>
                            Back to search
                        </button>

                        <div className="work-details-content">
                            {selectedWork.cover_image_url && (
                                <img
                                    src={selectedWork.cover_image_url}
                                    alt={`Cover of ${selectedWork.title}`}
                                />
                            )}

                            <div className="work-details-info">
                                <h2>{selectedWork.title}</h2>

                                <button
                                    onClick={() => onAddToReadingList(selectedWork.work_id)}
                                    disabled={isAddingToReadingList}
                                >
                                    {isAddingToReadingList ? 'Adding...' : 'Add to Reading List'}
                                </button>

                                {readingListMessage && (
                                    <p className="search-status">{readingListMessage}</p>
                                )}

                                <h3>Author</h3>
                                <p>
                                    {selectedWork.authors.map(author => author.name).join(', ')}
                                </p>

                                <h3>Description</h3>
                                <p>
                                    {selectedWork.description || 'No description available.'}
                                </p>

                                <h3>Publication details</h3>
                                <p>Original year: {selectedWork.original_year ?? 'Unknown'}</p>
                                <p>Original language: {selectedWork.original_language ?? 'Unknown'}</p>

                                <h3>Series</h3>
                                {selectedWork.series.length > 0 ? (
                                    selectedWork.series.map(series => (
                                        <p key={series.series_id}>
                                            {series.name}
                                            {series.position !== null && ` — Book ${series.position}`}
                                        </p>
                                    ))
                                ) : (
                                    <p>Not part of a known series.</p>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </section>

            <section className="reading-list-section">
                <h2>My Reading List</h2>

                {isLoadingReadingList ? (
                    <p>Loading your books...</p>
                ) : readingList.length === 0 ? (
                    <p>Your reading list is empty. Discover a book to get started!</p>
                ) : (
                    <div className="reading-list-grid">
                        {readingList.map(item => (
                            <article className="reading-list-card" key={item.id}>
                                <h3>Book ID: {item.workId}</h3>
                                <p>Status: {item.status.replaceAll('_', ' ')}</p>
                            </article>
                        ))}
                    </div>
                )}
            </section>

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
        </main>


    )

}

export default Home