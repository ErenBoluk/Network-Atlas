import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeSearch, filterTopics, parseProgress, getStats, nextTopic } from '../src/lib/learning.js'

const topics = [
  { id: 'ip', title: 'IP Adresleme', category: 'basics', tags: ['IPv4', 'subnetting'], description: 'Ağ adreslerini öğren.' },
  { id: 'route', title: 'Yönlendirme', category: 'routing', tags: ['OSPF'], description: 'Rotaları keşfet.' },
  { id: 'dns', title: 'DNS', category: 'basics', tags: ['servis'], description: 'İsim çözümleme.' },
]

test('search matches Turkish dotted/dotless I and accentless queries', () => {
  assert.equal(normalizeSearch('İLETİŞİM AĞI'), 'iletisim agi')
  assert.deepEqual(filterTopics(topics, { query: 'yonlendirme' }).map(t => t.id), ['route'])
  assert.deepEqual(filterTopics(topics, { query: 'IP' }).map(t => t.id), ['ip'])
  assert.deepEqual(filterTopics(topics, { query: 'SUBNETTING' }).map(t => t.id), ['ip'])
})

test('category, bookmark and status filters combine instead of replacing one another', () => {
  const state = { statuses: { ip: 'done', dns: 'learning' }, bookmarks: ['ip', 'route'] }
  assert.deepEqual(filterTopics(topics, { category: 'basics', status: 'done', bookmarked: true }, state).map(t => t.id), ['ip'])
  assert.deepEqual(filterTopics(topics, { status: 'todo' }, state).map(t => t.id), ['route'])
  assert.deepEqual(filterTopics(topics, { query: 'does not exist' }), [])
})

test('corrupt, null and unknown local storage values recover safely', () => {
  for (const value of ['{broken', 'null', '[]', '12', '"text"', null]) {
    assert.deepEqual(parseProgress(value, topics), { statuses: {}, bookmarks: [], notes: {}, theme: 'light' })
  }
  assert.deepEqual(parseProgress(JSON.stringify({
    statuses: { ip: 'done', route: 'invalid', unknown: 'done' },
    bookmarks: ['ip', 'ip', 'unknown', 4],
    notes: { dns: 'test note', unknown: 'bad', ip: 12 }, theme: 'dark',
  }), topics), { statuses: { ip: 'done' }, bookmarks: ['ip'], notes: { dns: 'test note' }, theme: 'dark' })
})

test('progress counts valid curriculum topics and handles an empty curriculum', () => {
  assert.deepEqual(getStats(topics, { ip: 'done', dns: 'learning', ghost: 'done' }), { completed: 1, learning: 1, total: 3, percent: 33 })
  assert.deepEqual(getStats([], {}), { completed: 0, learning: 0, total: 0, percent: 0 })
})

test('continue prioritizes learning topics and returns null when all complete', () => {
  assert.equal(nextTopic(topics, { dns: 'learning' })?.id, 'dns')
  assert.equal(nextTopic(topics, { ip: 'done' })?.id, 'route')
  assert.equal(nextTopic(topics, { ip: 'done', route: 'done', dns: 'done' }), null)
})
