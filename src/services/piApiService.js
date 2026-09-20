/**
 * piApiService.js
 * ---------------------------------------------------------------------------
 * Mock data layer that simulates the Aveva PI Web API (https://<piserver>/piwebapi).
 *
 * Every exported function mirrors a real PI Web API call so this file is the
 * only thing that needs to change to point the app at a live PI system:
 *
 *   searchTags(query)        -> GET /piwebapi/dataservers/{webId}/points?nameFilter=
 *   getTagSnapshot(tagName)  -> GET /piwebapi/streams/{webId}/value
 *   getTagTrend(tagName, h)  -> GET /piwebapi/streams/{webId}/recorded?startTime=*-Nh
 *   getAFRoot()              -> GET /piwebapi/assetdatabases/{webId}/elements
 *   getAFChildren(elementId) -> GET /piwebapi/elements/{webId}/elements
 *
 * Toggle VITE_USE_MOCK_API=false and set VITE_PI_WEB_API_BASE_URL in .env to
 * wire this up to a real PI Web API instance without touching any component.
 * ---------------------------------------------------------------------------
 */

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false'
const BASE_URL = import.meta.env.VITE_PI_WEB_API_BASE_URL ?? ''

/** Simulated network latency so loading states feel realistic on a plant Wi-Fi. */
const LATENCY_MS = 350

/** PI quality/digital states. "Good" is normal; the rest map to alarm colors in the UI. */
export const QUALITY = {
  GOOD: 'Good',
  IO_TIMEOUT: 'I/O Timeout',
  CONFIGURE: 'Configure',
  BAD_INPUT: 'Bad Input',
  SCAN_OFF: 'Scan Off'
}

const BAD_QUALITIES = new Set([QUALITY.IO_TIMEOUT, QUALITY.BAD_INPUT])
const WARN_QUALITIES = new Set([QUALITY.CONFIGURE, QUALITY.SCAN_OFF])

function delay(ms = LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function seededRandom(seed) {
  // Deterministic pseudo-random generator so a given tag always renders the
  // same-looking trend/history between renders (mulberry32).
  let t = seed + 0x6d2b79f5
  return function () {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

/**
 * Mock PI point catalog. In a real system this would come from
 * GET /piwebapi/dataservers/{webId}/points
 */
const MOCK_TAGS = [
  { name: 'FIC101.PV', description: 'Feed Flow Controller PV', units: 'gpm', base: 142, noise: 4, quality: QUALITY.GOOD, digital: false },
  { name: 'FIC101.OUT', description: 'Feed Flow Controller Output', units: '%', base: 62, noise: 2, quality: QUALITY.GOOD, digital: false },
  { name: 'TIC202.PV', description: 'Reactor 1 Temperature', units: '\u00b0F', base: 310, noise: 3, quality: QUALITY.GOOD, digital: false },
  { name: 'PT301.PV', description: 'Separator Pressure', units: 'psig', base: 84, noise: 1.5, quality: QUALITY.CONFIGURE, digital: false },
  { name: 'LT450.PV', description: 'Feed Tank Level', units: '%', base: 58, noise: 5, quality: QUALITY.GOOD, digital: false },
  { name: 'PMP12.STATUS', description: 'Feed Pump 12 Run Status', units: 'state', base: 1, noise: 0, quality: QUALITY.GOOD, digital: true },
  { name: 'AI205.PV', description: 'Cooling Water Return Temp', units: '\u00b0F', base: 92, noise: 1, quality: QUALITY.IO_TIMEOUT, digital: false },
  { name: 'FT118.PV', description: 'Product Discharge Flow', units: 'gpm', base: 210, noise: 6, quality: QUALITY.GOOD, digital: false },
  { name: 'VLV22.POS', description: 'Bypass Valve Position', units: '%', base: 35, noise: 2, quality: QUALITY.GOOD, digital: false },
  { name: 'PT303.PV', description: 'Compressor Suction Pressure', units: 'psig', base: 45, noise: 1, quality: QUALITY.BAD_INPUT, digital: false },
  { name: 'TIC210.PV', description: 'Reactor 2 Temperature', units: '\u00b0F', base: 298, noise: 2.5, quality: QUALITY.GOOD, digital: false },
  { name: 'LI512.PV', description: 'Product Tank Level', units: '%', base: 71, noise: 3, quality: QUALITY.SCAN_OFF, digital: false }
]

/**
 * Mock AF (Asset Framework) hierarchy. In a real system this would come from
 * GET /piwebapi/assetdatabases/{webId}/elements and recursive child calls.
 */
const MOCK_AF_TREE = [
  {
    id: 'af-plant-a',
    name: 'Plant A \u2014 Polymer Unit',
    path: '\\\\AFServer01\\PlantModel\\Plant A',
    template: 'Site',
    tags: ['FIC101.PV', 'LT450.PV'],
    children: [
      {
        id: 'af-reactor-1',
        name: 'Reactor 1',
        path: '\\\\AFServer01\\PlantModel\\Plant A\\Reactor 1',
        template: 'ReactorVessel',
        tags: ['TIC202.PV', 'PT301.PV', 'PMP12.STATUS']
      },
      {
        id: 'af-reactor-2',
        name: 'Reactor 2',
        path: '\\\\AFServer01\\PlantModel\\Plant A\\Reactor 2',
        template: 'ReactorVessel',
        tags: ['TIC210.PV', 'VLV22.POS']
      },
      {
        id: 'af-separator',
        name: 'Separator 1',
        path: '\\\\AFServer01\\PlantModel\\Plant A\\Separator 1',
        template: 'SeparatorVessel',
        tags: ['PT301.PV', 'FT118.PV']
      }
    ]
  },
  {
    id: 'af-plant-b',
    name: 'Plant B \u2014 Utilities',
    path: '\\\\AFServer01\\PlantModel\\Plant B',
    template: 'Site',
    tags: ['AI205.PV'],
    children: [
      {
        id: 'af-cooling',
        name: 'Cooling Water Loop',
        path: '\\\\AFServer01\\PlantModel\\Plant B\\Cooling Water Loop',
        template: 'UtilityLoop',
        tags: ['AI205.PV', 'PT303.PV']
      },
      {
        id: 'af-tankfarm',
        name: 'Tank Farm',
        path: '\\\\AFServer01\\PlantModel\\Plant B\\Tank Farm',
        template: 'StorageArea',
        tags: ['LI512.PV']
      }
    ]
  }
]

function findTag(tagName) {
  return MOCK_TAGS.find((t) => t.name.toLowerCase() === tagName.toLowerCase())
}

function buildSnapshot(tag) {
  const rand = seededRandom(hashString(tag.name) ^ Date.now() >>> 10)
  const jitter = (rand() - 0.5) * 2 * tag.noise
  const value = tag.digital ? tag.base : Math.round((tag.base + jitter) * 100) / 100
  return {
    tagName: tag.name,
    description: tag.description,
    units: tag.units,
    value,
    displayValue: tag.digital ? (value ? 'Running' : 'Stopped') : `${value.toFixed(tag.digital ? 0 : 2)}`,
    timestamp: new Date().toISOString(),
    quality: tag.quality,
    isBad: BAD_QUALITIES.has(tag.quality),
    isWarning: WARN_QUALITIES.has(tag.quality),
    questionable: tag.quality !== QUALITY.GOOD
  }
}

/**
 * Simulates GET /piwebapi/dataservers/{webId}/points?nameFilter={query}*
 */
export async function searchTags(query) {
  await delay()
  const q = query.trim().toLowerCase()
  const results = !q
    ? MOCK_TAGS
    : MOCK_TAGS.filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
  return results.map(buildSnapshot)
}

/**
 * Simulates GET /piwebapi/streams/{webId}/value
 */
export async function getTagSnapshot(tagName) {
  await delay(200)
  const tag = findTag(tagName)
  if (!tag) {
    throw new Error(`Tag "${tagName}" was not found on the configured Data Server.`)
  }
  return buildSnapshot(tag)
}

/**
 * Simulates GET /piwebapi/streams/{webId}/recorded?startTime=*-12h&endTime=*
 * Returns an array of { time, value, quality } points for sparkline rendering.
 */
export async function getTagTrend(tagName, hours = 12) {
  await delay(300)
  const tag = findTag(tagName)
  if (!tag) {
    throw new Error(`Tag "${tagName}" was not found on the configured Data Server.`)
  }

  const rand = seededRandom(hashString(tag.name))
  const points = []
  const now = Date.now()
  const stepMinutes = (hours * 60) / 36 // 36 samples across the window
  const isBad = BAD_QUALITIES.has(tag.quality)

  let drift = 0
  for (let i = 36; i >= 0; i--) {
    const t = new Date(now - i * stepMinutes * 60 * 1000)
    drift += (rand() - 0.5) * (tag.noise * 0.4)
    drift *= 0.9 // mean-revert so the trend doesn't wander off unrealistically
    const value = tag.digital
      ? tag.base
      : Math.round((tag.base + drift + (rand() - 0.5) * tag.noise) * 100) / 100

    // Tags in a bad-quality state show their trend flatlining near the last
    // good value, mimicking a stuck I/O Timeout on a real PI point.
    points.push({
      time: t.toISOString(),
      label: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: isBad && i < 6 ? points[points.length - 1]?.value ?? value : value
    })
  }
  return points
}

/**
 * Simulates GET /piwebapi/assetdatabases/{webId}/elements (root level).
 */
export async function getAFRoot() {
  await delay(250)
  return MOCK_AF_TREE
}

/**
 * Simulates GET /piwebapi/elements/{webId}/elements (child elements)
 * combined with attribute snapshot lookups for each tag reference.
 */
export async function getAFElementDetail(elementId) {
  await delay(200)
  const flat = MOCK_AF_TREE.flatMap((el) => [el, ...(el.children ?? [])])
  const element = flat.find((el) => el.id === elementId)
  if (!element) return null

  const tagSnapshots = await Promise.all(
    element.tags.map((tagName) => getTagSnapshot(tagName).catch(() => null))
  )
  return { ...element, tagSnapshots: tagSnapshots.filter(Boolean) }
}

/**
 * Simulates a combined AF path / element name search across
 * GET /piwebapi/elements/search?query={query}
 */
export async function searchAFElements(query) {
  await delay()
  const q = query.trim().toLowerCase()
  const flat = MOCK_AF_TREE.flatMap((el) => [el, ...(el.children ?? [])])
  if (!q) return flat
  return flat.filter(
    (el) => el.name.toLowerCase().includes(q) || el.path.toLowerCase().includes(q)
  )
}

export const apiConfig = {
  usingMock: USE_MOCK,
  baseUrl: BASE_URL
}
