
import type { User } from '../api/auth'
import type { ReadingListItem } from '../api/readingList'
import type {
    Work,
    Author,
    Series,
} from '../types/work'
import type { SelectedItem } from '../hooks/useBookSearch'
import type { SearchType } from '../api/works'
import Navigation from '../components/layout/Navigation'
import InformationModal from '../components/books/InformationModal'

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
    selectedItem: SelectedItem | null
    isLoadingItem: boolean

    onSearch: () => void
    onSelectWork: (workId: number) => void
    onSelectAuthor: (authorId: number) => void
    onSelectSeries: (seriesId: number) => void
    onClearSelectedItem: () => void
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
    selectedItem,
    isLoadingItem,
    onSearch,
    onSelectWork,
    onSelectAuthor,
    onSelectSeries,
    onClearSelectedItem,
    onAddToReadingList,
    onLogout,
}: HomeProps) {




    /** Renders a book search result card. */
    function renderWorkCard(work: Work) {
        return (
            <article
                className="result-card"
                key={`work-${work.work_id}`}
                onClick={() => onSelectWork(work.work_id)}
            >
                <div className="result-card-image">
                    {work.cover_image_url ? (
                        <img src={work.cover_image_url} alt={`Cover of ${work.title}`} />
                    ) : (
                        <div className="no-image-placeholder book-placeholder">
                            <span>▤</span>
                            <small>Book</small>
                        </div>
                    )}
                </div>

                <div className="result-card-info">
                    <h3>{work.title}</h3>

                    <p>{work.original_year ?? 'Year unknown'}</p>

                    <p className="result-card-description">
                        {work.description || 'No description available.'}
                    </p>
                </div>
            </article>
        )
    }

    /** Renders an author search result card. */
    function renderAuthorCard(author: Author) {
        return (
            <article
                className="result-card"
                key={`author-${author.author_id}`}
                onClick={() => onSelectAuthor(author.author_id)}
            >
                <div className="result-card-image">
                    {author.image_url ? (
                        <img src={author.image_url} alt={`Portrait of ${author.name}`} />
                    ) : (
                        <div className="no-image-placeholder author-placeholder">
                            <span>♙</span>
                            <small>AUTHOR</small>
                        </div>
                    )}
                </div>

                <div className="result-card-info">
                    <h3>{author.name}</h3>

                    <p>
                        {author.birth ?? 'Unknown'}
                        {author.death ? ` – ${author.death}` : ''}
                    </p>

                    <p className="result-card-description">
                        {author.description || 'No biography available.'}
                    </p>
                </div>
            </article>
        )
    }

    /** Renders a series search result card. */
    function renderSeriesCard(series: Series) {
        return (
            <article
                className="result-card"
                key={`series-${series.series_id}`}
                onClick={() => onSelectSeries(series.series_id)}
            >
                <div className="result-card-image">
                    <div className="no-image-placeholder series-placeholder">
                        <span>▤</span>
                        <small>SERIES</small>
                    </div>
                </div>
                
                <div className="result-card-info">
                    <h3>{series.name}</h3>

                    <p className="result-card-description">
                        {series.description || 'No description available.'}
                    </p>
                </div>
            </article>
        )
    }



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
                        placeholder="Search books, authors and series..."
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

                {/* All search results */}
                {searchType === 'all' && (
                    <section className="search-results">
                        <div className="results-grid">
                            {searchResults.map(renderWorkCard)}
                            {authorResults.map(renderAuthorCard)}
                            {seriesResults.map(renderSeriesCard)}
                        </div>
                    </section>
                )}

                {/* Book search results */}
                {searchType === 'works' && searchResults.length > 0 && (
                    <section className="search-results">
                        <div className="results-grid">
                            {searchResults.map(renderWorkCard)}
                        </div>
                    </section>
                )}

                {/* Author search results */}
                {searchType === 'authors' && authorResults.length > 0 && (
                    <section className="search-results">
                        <div className="results-grid">
                            {authorResults.map(renderAuthorCard)}
                        </div>
                    </section>
                )}

                {/* Series search results */}
                {searchType === 'series' && seriesResults.length > 0 && (
                    <section className="search-results">
                        <div className="results-grid">
                            {seriesResults.map(renderSeriesCard)}
                        </div>
                    </section>
                )}

                {isLoadingItem && (
                    <p className="search-status">Loading information...</p>
                )}

                {selectedItem && (
                    <InformationModal
                        selectedItem={selectedItem}
                        onClose={onClearSelectedItem}
                        onSelectWork={onSelectWork}
                        onSelectAuthor={onSelectAuthor}
                        onSelectSeries={onSelectSeries}
                    />
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
