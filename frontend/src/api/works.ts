import type {
  Work,
  FullWork,
  FullAuthor,
  FullSeries,
  SearchResponse,
} from '../types/work'

const BOOK_API_URL = 'http://localhost:3000/api/works'

/** Defines the available search categories. */
export type SearchType = 'all' | 'works' | 'authors' | 'series'

/** Searches the book API by query and category. */
export async function searchWorks(
  query: string,
  type: SearchType = 'all'
): Promise<SearchResponse>  {
  const params = new URLSearchParams({
    query,
  })

  if (type !== 'all') {
    params.set('type', type)
  }

  const response = await fetch(
    `${BOOK_API_URL}/search?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error('Could not search the library.')
  }

  return response.json()
}

/** Fetches full details for a selected book. */
export async function getFullWork(workId: number): Promise<FullWork> {
  const response = await fetch(
    `${BOOK_API_URL}/${workId}/full`
  )

  if (!response.ok) {
    throw new Error('Could not fetch work details.')
  }

  return response.json()
}



/** Fetches full details for a selected author. */
export async function getFullAuthor(
  authorId: number
): Promise<FullAuthor> {
  const response = await fetch(
    `${BOOK_API_URL}/authors/${authorId}/full`
  )

  if (!response.ok) {
    throw new Error('Could not fetch author details.')
  }

  return response.json()
}



/** Fetches full details for a selected series. */
export async function getFullSeries(
  seriesId: number
): Promise<FullSeries> {
  const response = await fetch(
    `${BOOK_API_URL}/series/${seriesId}/full`
  )

  if (!response.ok) {
    throw new Error('Could not fetch series details.')
  }

  return response.json()
}
