
import { useState } from 'react'
import { searchWorks, getFullWork, type SearchType } from '../api/works'
import type {
  Work,
  FullWork,
  Author,
  Series,
} from '../types/work'

/**
 * useBookSearch
 *
 * Manages searching across books, authors and series.
 * Also handles selected book details and loading states.
 */
export function useBookSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('all')

  const [searchResults, setSearchResults] = useState<Work[]>([])
  const [authorResults, setAuthorResults] = useState<Author[]>([])
  const [seriesResults, setSeriesResults] = useState<Series[]>([])

  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const [selectedWork, setSelectedWork] = useState<FullWork | null>(null)
  const [isLoadingWork, setIsLoadingWork] = useState(false)

  /** Searches the selected category using the Book API. */
  async function handleBookSearch() {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError('')

    setSearchResults([])
    setAuthorResults([])
    setSeriesResults([])
    setSelectedWork(null)

    try {
      const results = await searchWorks(searchQuery, searchType)

      setSearchResults(results.works)
      setAuthorResults(results.authors)
      setSeriesResults(results.series)
    } catch {
      setSearchError('Could not search the library. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  /** Loads the full details of a selected book. */
  async function handleSelectWork(workId: number) {
    setIsLoadingWork(true)
    setSelectedWork(null)

    try {
      const work = await getFullWork(workId)
      setSelectedWork(work)
    } catch {
      setSearchError('Could not load work details. Please try again.')
    } finally {
      setIsLoadingWork(false)
    }
  }

  return {
    searchQuery,
    setSearchQuery,

    searchType,
    setSearchType,

    searchResults,
    setSearchResults,
    authorResults,
    seriesResults,

    isSearching,
    setIsSearching,
    searchError,
    setSearchError,

    selectedWork,
    setSelectedWork,
    isLoadingWork,
    setIsLoadingWork,

    handleBookSearch,
    handleSelectWork,
  }
}
