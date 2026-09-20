import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import TagDashboard from './components/TagDashboard.jsx'
import AFCards from './components/AFCards.jsx'
import { searchTags, getAFRoot, searchAFElements, apiConfig } from './services/piApiService.js'

function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const setTrue = () => setOnline(true)
    const setFalse = () => setOnline(false)
    window.addEventListener('online', setTrue)
    window.addEventListener('offline', setFalse)
    return () => {
      window.removeEventListener('online', setTrue)
      window.removeEventListener('offline', setFalse)
    }
  }, [])

  if (online) return null
  return (
    <div className="bg-signal-warn/15 px-4 py-1.5 text-center text-xs font-medium text-signal-warn">
      Offline — showing last cached tag values and AF structure
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('tags')
  const [query, setQuery] = useState('')

  const [tags, setTags] = useState([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [tagsError, setTagsError] = useState(null)

  const [afRoot, setAfRoot] = useState([])
  const [afSearchResults, setAfSearchResults] = useState(null)
  const [afLoading, setAfLoading] = useState(true)

  // Initial load: pull the full tag catalog and root AF hierarchy once.
  useEffect(() => {
    searchTags('')
      .then(setTags)
      .catch((e) => setTagsError(e.message))
      .finally(() => setTagsLoading(false))

    getAFRoot()
      .then(setAfRoot)
      .finally(() => setAfLoading(false))
  }, [])

  function handleSearch(value) {
    setQuery(value)
    if (mode === 'tags') {
      setTagsLoading(true)
      setTagsError(null)
      searchTags(value)
        .then(setTags)
        .catch((e) => setTagsError(e.message))
        .finally(() => setTagsLoading(false))
    } else {
      if (!value.trim()) {
        setAfSearchResults(null)
        return
      }
      searchAFElements(value).then(setAfSearchResults)
    }
  }

  function handleModeChange(nextMode) {
    setMode(nextMode)
    setQuery('')
    setAfSearchResults(null)
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl pb-10">
      <OfflineBanner />

      <header className="sticky top-0 z-10 border-b border-graphite-700 bg-graphite-900/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-ink-100">Mobile Tag &amp; Asset Inspector</h1>
            <p className="text-[11px] text-ink-500">
              {apiConfig.usingMock ? 'Connected to simulated PI Web API' : apiConfig.baseUrl}
            </p>
          </div>
          <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-signal-good shadow-[0_0_8px_rgba(61,220,151,0.6)]" />
        </div>
        <SearchBar onSearch={handleSearch} mode={mode} onModeChange={handleModeChange} />
      </header>

      <main className="space-y-6 px-4 pt-4">
        {mode === 'tags' ? (
          <TagDashboard tags={tags} loading={tagsLoading} error={tagsError} />
        ) : afSearchResults ? (
          <AFCards title={`Results for "${query}"`} elements={afSearchResults} />
        ) : afLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-graphite-800/70" />
        ) : (
          afRoot.map((site) => (
            <AFCards key={site.id} title={site.name} elements={[site, ...(site.children ?? [])]} />
          ))
        )}
      </main>
    </div>
  )
}
