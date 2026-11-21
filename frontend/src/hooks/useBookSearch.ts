import { useState } from 'react'
import { searchWorks, getFullWork } from '../api/works'
import type { Work, FullWork } from '../types/work'

/**
 * useBookSearch
 *
 * Manages book searching and selection.
 * Handles search results, selected book details,
 * loading states and error messages.
 */
export function useBookSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Work[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selectedWork, setSelectedWork] = useState<FullWork | null>(null)
  const [isLoadingWork, setIsLoadingWork] = useState(false)


  /** Searches for books using the Book API. */
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
  searchResults,
  setSearchResults,
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