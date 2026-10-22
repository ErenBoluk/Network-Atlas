export const STORAGE_KEY = 'network-atlas:v1'
export const STATUS_LABELS = { todo: 'Başlanmadı', learning: 'Öğreniliyor', done: 'Tamamlandı' }

export function normalizeSearch(value) {
  return String(value ?? '').toLocaleLowerCase('tr-TR').replaceAll('ı', 'i')
    .normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()
}

export function filterTopics(topics, filters = {}, progress = {}) {
  const query = normalizeSearch(filters.query)
  return topics.filter(topic => {
    const haystack = normalizeSearch([topic.title, topic.description, ...(topic.tags ?? [])].join(' '))
    return (!query || haystack.includes(query))
      && (!filters.category || filters.category === 'all' || topic.category === filters.category)
      && (!filters.status || filters.status === 'all' || (progress.statuses?.[topic.id] ?? 'todo') === filters.status)
      && (!filters.bookmarked || progress.bookmarks?.includes(topic.id))
  })
}

export function parseProgress(raw, topics) {
  const empty = { statuses: {}, bookmarks: [], notes: {}, theme: 'light' }
  try {
    const value = JSON.parse(raw)
    if (!value || typeof value !== 'object' || Array.isArray(value)) return empty
    const ids = new Set(topics.map(topic => topic.id))
    const statuses = Object.fromEntries(Object.entries(value.statuses ?? {}).filter(([id, status]) => ids.has(id) && Object.hasOwn(STATUS_LABELS, status)))
    const bookmarks = [...new Set((Array.isArray(value.bookmarks) ? value.bookmarks : []).filter(id => ids.has(id)))]
    const notes = Object.fromEntries(Object.entries(value.notes ?? {}).filter(([id, note]) => ids.has(id) && typeof note === 'string').map(([id, note]) => [id, note.slice(0, 10000)]))
    return { statuses, bookmarks, notes, theme: value.theme === 'dark' ? 'dark' : 'light' }
  } catch { return empty }
}

export function getStats(topics, statuses = {}) {
  const completed = topics.filter(topic => statuses[topic.id] === 'done').length
  const learning = topics.filter(topic => statuses[topic.id] === 'learning').length
  return { completed, learning, total: topics.length, percent: topics.length ? Math.round(completed / topics.length * 100) : 0 }
}

export function nextTopic(topics, statuses = {}) {
  return topics.find(topic => statuses[topic.id] === 'learning') ?? topics.find(topic => statuses[topic.id] !== 'done') ?? null
}
