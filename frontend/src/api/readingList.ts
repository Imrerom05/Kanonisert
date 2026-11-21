const API_URL = 'http://localhost:3000/api/reading-list'

export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'READ'

export interface ReadingListItem {
  id: string
  userId: string
  workId: number
  status: ReadingStatus
  addedAt: string
  updatedAt: string
}

export async function getReadingList(): Promise<ReadingListItem[]> {
  const response = await fetch(API_URL, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Could not load reading list.')
  }

  return response.json()
}

export async function addToReadingList(workId: number): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workId }),
  })

  if (!response.ok) {
    throw new Error('Could not add book to reading list.')
  }
}

export async function updateReadingStatus(
  workId: number,
  status: ReadingStatus
): Promise<void> {
  const response = await fetch(`${API_URL}/${workId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Could not update reading status.')
  }
}

export async function removeFromReadingList(workId: number): Promise<void> {
  const response = await fetch(`${API_URL}/${workId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Could not remove book from reading list.')
  }
}
