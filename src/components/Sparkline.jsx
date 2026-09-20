import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts'

const STROKE_BY_STATE = {
  good: '#3DDC97',
  warn: '#F2B705',
  bad: '#E5484D'
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-md border border-graphite-600 bg-graphite-800 px-2.5 py-1.5 text-xs shadow-panel">
      <p className="font-mono text-ink-100">{point.value}</p>
      <p className="text-ink-500">{point.label}</p>
    </div>
  )
}

/**
 * Lightweight 12-hour sparkline. Deliberately axis-free and compact so it
 * drops cleanly into a tag card without competing with the numeric readout.
 */
export default function Sparkline({ data, state = 'good', height = 44 }) {
  if (!data || data.length === 0) {
    return <div className="h-11 w-full rounded bg-graphite-800/60" />
  }

  const stroke = STROKE_BY_STATE[state] ?? STROKE_BY_STATE.good

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
          <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3A434C', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
