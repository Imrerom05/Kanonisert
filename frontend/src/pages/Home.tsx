import type { User } from '../api/auth'
import type { ReadingListItem } from '../api/readingList'
import type {
    Work,
    FullWork,
    Author,
    Series,
} from '../types/work'
import type { SearchType } from '../api/works'
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
    searchType: SearchType
    onSearchTypeChange: (type: SearchType) => void
    authorResults: Author[]
    seriesResults: Series[]
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
    searchType,
    onSearchTypeChange,
    authorResults,
    seriesResults,
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


                <div className="search-categories">
                    <button
                        type="button"
                        className={searchType === 'all' ? 'search-category-button active' : 'search-category-button'}
                        onClick={() => onSearchTypeChange('all')}
                        aria-pressed={searchType === 'all'}
                    >
                        <span>All</span>
                    </button>


                    <button
                        type="button"
                        className={searchType === 'works' ? 'search-category-button active' : 'search-category-button'}
                        onClick={() => onSearchTypeChange('works')}
                        aria-pressed={searchType === 'works'}
                    >
                        <span>Books</span>
                    </button>

                    <button
                        type="button"
                        className={searchType === 'series' ? 'search-category-button active' : 'search-category-button'}
                        onClick={() => onSearchTypeChange('series')}
                        aria-pressed={searchType === 'series'}
                    >
                        <span>Series</span>
                    </button>

                    <button
                        type="button"
                        className={searchType === 'authors' ? 'search-category-button active' : 'search-category-button'}
                        onClick={() => onSearchTypeChange('authors')}
                        aria-pressed={searchType === 'authors'}
                    >
                        <span>Authors</span>
                    </button>
                </div>


                {searchError && (
                    <p className="search-error">{searchError}</p>
                )}

                {isSearching && (
                    <p className="search-status">Searching the library...</p>
                )}



                {searchType === 'all' && (
                    <section className="search-results">
                        <div className="results-grid">
                            {searchResults.map((work) => (
                                <article
                                    className="result-card"
                                    key={`work-${work.work_id}`}
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

                            {authorResults.map((author) => (
                                <article
                                    className="result-card"
                                    key={`author-${author.author_id}`}
                                >
                                    {author.image_url && (
                                        <img
                                            src={author.image_url}
                                            alt={`Portrait of ${author.name}`}
                                        />
                                    )}
                                    <h3>{author.name}</h3>
                                    {author.description && <p>{author.description}</p>}
                                </article>
                            ))}

                            {seriesResults.map((series) => (
                                <article
                                    className="result-card"
                                    key={`series-${series.series_id}`}
                                >
                                    <h3>{series.name}</h3>
                                    {series.description && <p>{series.description}</p>}
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {searchType === 'works' && searchResults.length > 0 && (
                    <section className="search-results">
                        <div className="results-grid">
                            {searchResults.map((work) => (
                                <article
                                    className="result-card"
                                    key={work.work_id}
                                    onClick={() => onSelectWork(work.work_id)}
                                >
                                    {work.cover_image_url && (
                                        <img src={work.cover_image_url} alt={`Cover of ${work.title}`} />
                                    )}
                                    <h3>{work.title}</h3>
                                    {work.original_year && <p>{work.original_year}</p>}
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {searchType === 'authors' && authorResults.length > 0 && (
                    <section className="search-results">
                        <div className="results-grid">
                            {authorResults.map((author) => (
                                <article className="result-card" key={author.author_id}>
                                    {author.image_url && (
                                        <img src={author.image_url} alt={`Portrait of ${author.name}`} />
                                    )}
                                    <h3>{author.name}</h3>
                                    {author.description && <p>{author.description}</p>}
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {searchType === 'series' && seriesResults.length > 0 && (
                    <section className="search-results">
                        <div className="results-grid">
                            {seriesResults.map((series) => (
                                <article className="result-card" key={series.series_id}>
                                    <h3>{series.name}</h3>
                                    {series.description && <p>{series.description}</p>}
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