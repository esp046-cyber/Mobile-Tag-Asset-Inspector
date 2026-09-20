import { useEffect, useState } from 'react'
import Sparkline from './Sparkline.jsx'
import { getTagTrend } from '../services/piApiService.js'

function qualityState(tag) {
  if (tag.isBad) return 'bad'
  if (tag.isWarning) return 'warn'
  return 'good'
}

const STATE_STYLES = {
  good: {
    ring: 'border-graphite-600',
    badge: 'bg-signal-good/15 text-signal-good',
    dot: 'bg-signal-good'
  },
  warn: {
    ring: 'border-signal-warn/40',
    badge: 'bg-signal-warn/15 text-signal-warn',
    dot: 'bg-signal-warn'
  },
  bad: {
    ring: 'border-signal-bad/50',
    badge: 'bg-signal-bad/15 text-signal-bad',
    dot: 'bg-signal-bad'
  }
}

function formatTimestamp(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function TagCard({ tag }) {
  const [trend, setTrend] = useState(null)
  const state = qualityState(tag)
  const styles = STATE_STYLES[state]

  useEffect(() => {
    let cancelled = false
    getTagTrend(tag.tagName, 12).then((points) => {
      if (!cancelled) setTrend(points)
    })
    return () => {
      cancelled = true
    }
  }, [tag.tagName])

  return (
    <article
      className={`rounded-xl border bg-graphite-800 p-4 shadow-panel ${styles.ring}`}
      aria-label={`Tag ${tag.tagName}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-sm font-semibold text-ink-100">
            {tag.tagName}
          </h3>
          <p className="truncate text-xs text-ink-500">{tag.description}</p>
        </div>
        <span
          className={`flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium ${styles.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot} ${state === 'bad' ? 'animate-pulse-slow' : ''}`} />
          {tag.quality}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="tabular font-mono text-2xl font-semibold text-ink-100">
            {tag.displayValue}
            {!tag.questionable && tag.units !== 'state' && (
              <span className="ml-1 text-sm font-normal text-ink-500">{tag.units}</span>
            )}
          </p>
          <p className="tabular mt-0.5 text-[11px] text-ink-500">
            as of {formatTimestamp(tag.timestamp)}
          </p>
        </div>
        <div className="w-32 flex-shrink-0 sm:w-40">
          <Sparkline data={trend} state={state} />
        </div>
      </div>
    </article>
  )
}

export default function TagDashboard({ tags, loading, error }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-graphite-800/70" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-signal-bad/40 bg-signal-bad/10 p-4 text-sm text-signal-bad">
        {error}
      </div>
    )
  }

  if (!tags || tags.length === 0) {
    return (
      <div className="rounded-xl border border-graphite-600 bg-graphite-800/60 p-6 text-center text-sm text-ink-500">
        No tags match that search. Try a partial name like <span className="font-mono text-ink-300">TIC</span> or{' '}
        <span className="font-mono text-ink-300">PT30</span>.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tags.map((tag) => (
        <TagCard key={tag.tagName} tag={tag} />
      ))}
    </div>
  )
}
