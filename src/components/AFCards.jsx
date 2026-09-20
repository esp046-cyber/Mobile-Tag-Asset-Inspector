import { useEffect, useState } from 'react'
import { getAFElementDetail } from '../services/piApiService.js'

function TagPill({ snapshot }) {
  const bad = snapshot.isBad
  const warn = snapshot.isWarning
  const color = bad ? 'text-signal-bad' : warn ? 'text-signal-warn' : 'text-signal-good'
  return (
    <div className="flex items-center justify-between gap-2 border-t border-graphite-700 py-1.5 first:border-t-0">
      <span className="truncate font-mono text-xs text-ink-300">{snapshot.tagName}</span>
      <span className={`tabular flex-shrink-0 font-mono text-xs font-medium ${color}`}>
        {snapshot.displayValue}
        {!snapshot.questionable && snapshot.units !== 'state' ? ` ${snapshot.units}` : ''}
      </span>
    </div>
  )
}

function AFCard({ element }) {
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    let cancelled = false
    getAFElementDetail(element.id).then((d) => {
      if (!cancelled) setDetail(d)
    })
    return () => {
      cancelled = true
    }
  }, [element.id])

  const badCount = detail?.tagSnapshots?.filter((t) => t.isBad).length ?? 0

  return (
    <div className="w-[78%] flex-shrink-0 snap-start rounded-xl border border-graphite-600 bg-graphite-800 p-4 shadow-panel sm:w-72">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-100">{element.name}</p>
          <p className="truncate font-mono text-[11px] text-ink-500">{element.template}</p>
        </div>
        {badCount > 0 && (
          <span className="flex-shrink-0 rounded-full bg-signal-bad/15 px-2 py-0.5 text-[11px] font-medium text-signal-bad">
            {badCount} bad
          </span>
        )}
      </div>

      <p className="mt-2 truncate font-mono text-[10px] text-ink-700" title={element.path}>
        {element.path}
      </p>

      <div className="mt-3 min-h-[3.5rem]">
        {!detail ? (
          <div className="h-14 animate-pulse rounded bg-graphite-700/60" />
        ) : detail.tagSnapshots.length === 0 ? (
          <p className="py-2 text-xs text-ink-500">No attributes mapped to PI Points.</p>
        ) : (
          detail.tagSnapshots.map((snap) => <TagPill key={snap.tagName} snapshot={snap} />)
        )}
      </div>
    </div>
  )
}

/**
 * Renders a hierarchy level of AF elements as a horizontally swipeable rail,
 * taking advantage of wide mobile displays to preview several assets at once.
 */
export default function AFCards({ title, elements }) {
  if (!elements || elements.length === 0) return null

  return (
    <section>
      {title && (
        <h2 className="mb-2 px-0.5 text-xs font-medium uppercase tracking-wide text-ink-500">
          {title}
        </h2>
      )}
      <div className="no-scrollbar snap-x-mandatory -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {elements.map((el) => (
          <AFCard key={el.id} element={el} />
        ))}
      </div>
    </section>
  )
}
