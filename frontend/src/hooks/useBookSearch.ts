
import { useState } from 'react'
import {
  searchWorks,
  getFullWork,
  getFullAuthor,
  getFullSeries,
  type SearchType,
} from '../api/works'
import type {
  Work,
  FullWork,
  Author,
  FullAuthor,
  Series,
  FullSeries,
} from '../types/work'


/** Represents whichever information popup is currently selected. */
export type SelectedItem =
  | { type: 'work'; data: FullWork }
  | { type: 'author'; data: FullAuthor }
  | { type: 'series'; data: FullSeries }


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

  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [isLoadingItem, setIsLoadingItem] = useState(false)

  /** Searches the selected category using the Book API. */
  async function handleBookSearch() {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError('')

    setSearchResults([])
    setAuthorResults([])
    setSeriesResults([])
    setSelectedItem(null)

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
    setIsLoadingItem(true)
    setSelectedItem(null)

    try {
      const work = await getFullWork(workId)
      setSelectedItem({ type: 'work', data: work })
    } catch {
      setSearchError('Could not load work details. Please try again.')
    } finally {
      setIsLoadingItem(false)
    }
  }


  /** Loads the full details of a selected author. */
  async function handleSelectAuthor(authorId: number) {
    setIsLoadingItem(true)
    setSelectedItem(null)

    try {
      const author = await getFullAuthor(authorId)
      setSelectedItem({ type: 'author', data: author })
    } catch {
      setSearchError('Could not load author details. Please try again.')
    } finally {
      setIsLoadingItem(false)
    }
  }



  /** Loads the full details of a selected series. */
  async function handleSelectSeries(seriesId: number) {
    setIsLoadingItem(true)
    setSelectedItem(null)

    try {
      const series = await getFullSeries(seriesId)
      setSelectedItem({ type: 'series', data: series })
    } catch {
      setSearchError('Could not load series details. Please try again.')
    } finally {
      setIsLoadingItem(false)
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

    selectedItem,
    setSelectedItem,
    isLoadingItem,

    handleSelectAuthor,
    handleSelectSeries,

    handleBookSearch,
    handleSelectWork,
  }
}
