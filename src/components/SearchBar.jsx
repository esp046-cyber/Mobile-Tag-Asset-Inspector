import { useState } from 'react'

export default function SearchBar({ onSearch, mode, onModeChange }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 rounded-xl border border-graphite-600 bg-graphite-800 px-3 py-2.5 shadow-panel focus-within:border-signal-info">
        <svg
          aria-hidden="true"
          className="h-5 w-5 flex-shrink-0 text-ink-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          inputMode="search"
          placeholder={
            mode === 'tags' ? 'Search tag name, e.g. TIC202.PV' : 'Search AF element or path'
          }
          className="w-full bg-transparent font-mono text-sm text-ink-100 placeholder:text-ink-700 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue('')
              onSearch('')
            }}
            className="text-ink-500 hover:text-ink-100"
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => onModeChange('tags')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'tags'
              ? 'bg-signal-info/15 text-signal-info'
              : 'bg-graphite-800 text-ink-500 hover:text-ink-300'
          }`}
        >
          Tags
        </button>
        <button
          type="button"
          onClick={() => onModeChange('af')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            mode === 'af'
              ? 'bg-signal-info/15 text-signal-info'
              : 'bg-graphite-800 text-ink-500 hover:text-ink-300'
          }`}
        >
          AF Elements
        </button>
      </div>
    </form>
  )
}
