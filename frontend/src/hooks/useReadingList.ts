import { useEffect, useState } from 'react'
import {
  addToReadingList,
  getReadingList,
  type ReadingListItem,
} from '../api/readingList'
import type { User } from '../api/auth'



/**
 * useReadingList
 *
 * Manages the user's reading list.
 * Handles loading, adding and tracking reading list items.
 */
export function useReadingList(user: User | null) {
  const [readingListMessage, setReadingListMessage] = useState('')
  const [isAddingToReadingList, setIsAddingToReadingList] = useState(false)
  const [readingList, setReadingList] = useState<ReadingListItem[]>([])
  const [isLoadingReadingList, setIsLoadingReadingList] = useState(false)


  /** Loads the user's reading list from the backend. */
  async function loadReadingList() {
    setIsLoadingReadingList(true)

    try {
      const items = await getReadingList()
      setReadingList(items)
    } catch (error) {
      console.error('Could not load reading list:', error)
    } finally {
      setIsLoadingReadingList(false)
    }
  }


  /**
   * Loads the reading list when a user logs in.
   * Clears it when the user logs out.
   */
  useEffect(() => {
    if (user) {
      loadReadingList()
    } else {
      setReadingList([])
    }
  }, [user])


    /** Adds the selected book to the user's reading list. */
  async function handleAddToReadingList(workId: number) {
    setIsAddingToReadingList(true)
    setReadingListMessage('')

    try {
      await addToReadingList(workId)
      await loadReadingList()
      setReadingListMessage('Book added to your reading list!')
    } catch (error) {
      setReadingListMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      )
    } finally {
      setIsAddingToReadingList(false)
    }
  }


    return {
    readingList,
    isLoadingReadingList,
    readingListMessage,
    isAddingToReadingList,
    handleAddToReadingList,
  }}