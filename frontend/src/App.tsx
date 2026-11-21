import './App.css'
import { useAuth } from './hooks/useAuth'
import Auth from './pages/Auth'
import { useReadingList } from './hooks/useReadingList'
import { useBookSearch } from './hooks/useBookSearch'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Discover from './pages/Discover'
import Profile from './pages/Profile'




function App() {
  const {
    user,
    isCheckingSession,
    signIn,
    signUp,
    signOut,
  } = useAuth()
  const {
    readingList,
    isLoadingReadingList,
    readingListMessage,
    isAddingToReadingList,
    handleAddToReadingList: addBookToReadingList,
  } = useReadingList(user)
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    selectedWork,
    setSelectedWork,
    isLoadingWork,
    handleBookSearch,
    handleSelectWork,
  } = useBookSearch()

  if (isCheckingSession) {
    return <main className="auth-page">Loading Kanonisert...</main>
  }


if (user) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              readingList={readingList}
              isLoadingReadingList={isLoadingReadingList}
              readingListMessage={readingListMessage}
              isAddingToReadingList={isAddingToReadingList}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              searchError={searchError}
              selectedWork={selectedWork}
              isLoadingWork={isLoadingWork}
              onSearch={handleBookSearch}
              onSelectWork={handleSelectWork}
              onClearSelectedWork={() => setSelectedWork(null)}
              onAddToReadingList={addBookToReadingList}
              onLogout={handleLogout}
            />
          }
        />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}


  async function handleLogout() {
    try {
      await signOut()
    } catch (error) {
      console.error('Could not sign out:', error)
    }
  }

  return (
    <Auth
      onLogin={signIn}
      onRegister={signUp}
    />
  )
}



export default App
