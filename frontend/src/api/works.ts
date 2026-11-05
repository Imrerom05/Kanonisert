import type { Work, FullWork } from '../types/work'


//const BOOK_API_URL = 'https://book-api-os07.onrender.com'
const BOOK_API_URL = 'http://localhost:3000/api/works'

export async function searchWorks(query: string): Promise<Work[]> {
  const response = await fetch(
    `${BOOK_API_URL}/search?query=${encodeURIComponent(query)}`
  )

  if (!response.ok) {
    throw new Error('Could not search for books.')
  }

  return response.json()
}


export async function getFullWork(workId: number): Promise<FullWork> {
  const response = await fetch(
    `${BOOK_API_URL}/${workId}/full`
  )

  if (!response.ok) {
    throw new Error('Could not fetch work details.')
  }

  return response.json()
}


