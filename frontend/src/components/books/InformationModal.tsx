
import type { SelectedItem } from '../../hooks/useBookSearch'

interface InformationModalProps {
  selectedItem: SelectedItem
  onClose: () => void
  onSelectWork: (workId: number) => void
  onSelectAuthor: (authorId: number) => void
  onSelectSeries: (seriesId: number) => void
}

/**
 * InformationModal
 *
 * Displays detailed information about a selected book,
 * author or series. Related items open in the same modal.
 */
function InformationModal({
  selectedItem,
  onClose,
  onSelectWork,
  onSelectAuthor,
  onSelectSeries,
}: InformationModalProps) {
  return (
    <div className="information-modal-overlay">
      <section
        className="information-modal"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="information-modal-close"
          onClick={onClose}
          aria-label="Close information"
        >
          ×
        </button>

        {/* BOOK INFORMATION */}
        {selectedItem.type === 'work' && (
          <>
            <h2>{selectedItem.data.title}</h2>

            {selectedItem.data.cover_image_url && (
              <img
                src={selectedItem.data.cover_image_url}
                alt={`Cover of ${selectedItem.data.title}`}
                className="information-modal-image"
              />
            )}

            <div className="information-modal-description">
              <p>
                {selectedItem.data.description || 'No description available.'}
              </p>
              <p>
                Original year: {selectedItem.data.original_year ?? 'Unknown'}
              </p>
              <p>
                Original language: {selectedItem.data.original_language ?? 'Unknown'}
              </p>
            </div>

            <div className="information-modal-related">
              <h3>Authors</h3>

              {selectedItem.data.authors.length > 0 ? (
                selectedItem.data.authors.map((author) => (
                  <button
                    type="button"
                    key={author.author_id}
                    onClick={() => onSelectAuthor(author.author_id)}
                  >
                    {author.name}
                  </button>
                ))
              ) : (
                <p>No authors listed.</p>
              )}
            </div>

            <div className="information-modal-related">
              <h3>Series</h3>

              {selectedItem.data.series.length > 0 ? (
                selectedItem.data.series.map((series) => (
                  <button
                    type="button"
                    key={series.series_id}
                    onClick={() => onSelectSeries(series.series_id)}
                  >
                    {series.name}
                    {series.position !== null && ` — Book ${series.position}`}
                  </button>
                ))
              ) : (
                <p>Not part of a known series.</p>
              )}
            </div>
          </>
        )}

        {/* AUTHOR INFORMATION */}
        {selectedItem.type === 'author' && (
          <>
            <h2>{selectedItem.data.name}</h2>

            {selectedItem.data.image_url && (
              <img
                src={selectedItem.data.image_url}
                alt={`Portrait of ${selectedItem.data.name}`}
                className="information-modal-image"
              />
            )}

            <div className="information-modal-description">
              <p>
                {selectedItem.data.description || 'No biography available.'}
              </p>
              <p>Born: {selectedItem.data.birth ?? 'Unknown'}</p>
              <p>Died: {selectedItem.data.death ?? 'Unknown'}</p>
            </div>

            <div className="information-modal-related">
              <h3>Books</h3>

              {selectedItem.data.works.length > 0 ? (
                selectedItem.data.works.map((work) => (
                  <button
                    type="button"
                    key={work.work_id}
                    onClick={() => onSelectWork(work.work_id)}
                  >
                    {work.title}
                  </button>
                ))
              ) : (
                <p>No books listed.</p>
              )}
            </div>
          </>
        )}

        {/* SERIES INFORMATION */}
        {selectedItem.type === 'series' && (
          <>
            <h2>{selectedItem.data.name}</h2>

            <div className="information-modal-description">
              <p>
                {selectedItem.data.description || 'No description available.'}
              </p>
            </div>

            <div className="information-modal-related">
              <h3>Books in this series</h3>

              {selectedItem.data.works.length > 0 ? (
                selectedItem.data.works
                  .slice()
                  .sort(
                    (a, b) =>
                      (a.position ?? Infinity) - (b.position ?? Infinity)
                  )
                  .map((work) => (
                    <button
                      type="button"
                      key={work.work_id}
                      onClick={() => onSelectWork(work.work_id)}
                    >
                      {work.position !== null && `Book ${work.position}: `}
                      {work.title}
                    </button>
                  ))
              ) : (
                <p>No books listed.</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default InformationModal
